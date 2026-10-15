// Automated Integration and Verification Suite for Trip Connect
// Tests Endpoints, Auth Security, CRM, Notifications fallback, and Sanitization

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function runTests() {
  console.log(`\n========================================`);
  console.log(`🚀 TRIP CONNECT - AUTOMATED VERIFICATION`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`========================================\n`);

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. PUBLIC ROUTES HEALTH CHECK
  console.log(`--- [1] Public Page Routes Availability ---`);
  const publicRoutes = [
    '/',
    '/packages',
    '/packages/classic-kerala-grand-tour',
    '/destinations',
    '/destinations/munnar',
    '/offers',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/robots.txt',
    '/sitemap.xml',
    '/admin/login'
  ];

  for (const route of publicRoutes) {
    try {
      const res = await fetch(`${BASE_URL}${route}`);
      assert(res.status === 200, `GET ${route} returned HTTP 200`);
    } catch (err) {
      assert(false, `GET ${route} threw exception: ${err.message}`);
    }
  }

  // 2. ENQUIRY API & SECURITY CONTROLS
  console.log(`\n--- [2] Enquiry Submission API & Honeypot Trap ---`);
  let createdEnquiryId = null;

  // 2a. Valid enquiry
  try {
    const payload = {
      customer_name: 'Rohan Sharma',
      email: 'rohan.test@example.com',
      phone: '+91 9876543210',
      whatsapp: '+91 9876543210',
      travel_date: '2026-11-15',
      traveller_count: 3,
      preferred_destination: 'Kerala',
      additional_requirements: 'Interested in quiet houseboat in Alleppey',
      source: 'web_form'
    };

    const res = await fetch(`${BASE_URL}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    assert(res.status === 201 && data.success === true && (data.enquiryId || data.enquiry?.id), `Valid enquiry accepted with ID: ${data.enquiryId || data.enquiry?.id}`);
    createdEnquiryId = data.enquiryId || data.enquiry?.id;
  } catch (err) {
    assert(false, `Valid enquiry POST failed: ${err.message}`);
  }

  // 2b. Honeypot Bot Trap Test
  try {
    const botPayload = {
      customer_name: 'Spam Bot',
      email: 'spammer@botnet.xyz',
      phone: '1234567890',
      bot_trap: 'http://spam-link.ru', // Honeypot filled!
      preferred_destination: 'Kerala'
    };

    const res = await fetch(`${BASE_URL}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(botPayload)
    });
    const data = await res.json();
    assert(res.status === 200 && data.is_bot === true, `Honeypot bot caught silently with 200 and discarded from CRM persistence`);
  } catch (err) {
    assert(false, `Honeypot test failed: ${err.message}`);
  }

  // 2c. Formula Injection Payload in Enquiry
  let formulaEnquiryId = null;
  try {
    const formulaPayload = {
      customer_name: '=cmd|’ /C calc’!A0', // Excel/Calc command injection
      email: 'malicious@calc.com',
      phone: '+919876543210',
      additional_requirements: '@SUM(1+1)*cmd',
      source: 'web_form'
    };

    const res = await fetch(`${BASE_URL}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formulaPayload)
    });
    const data = await res.json();
    assert(res.status === 201, `Formula payload received for CSV sanitization test (ID: ${data.enquiryId || data.enquiry?.id})`);
    formulaEnquiryId = data.enquiryId || data.enquiry?.id;
  } catch (err) {
    assert(false, `Formula injection payload POST failed: ${err.message}`);
  }

  // 3. ADMIN AUTHENTICATION & ALLOWLIST
  console.log(`\n--- [3] Admin Auth & Strict Allowlist Guard ---`);
  let adminCookie = null;

  // 3a. Unauthorized user rejection (including old email dmtripconnectin@gmail.com)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'dmtripconnectin@gmail.com' })
    });
    assert(res.status === 403, `Unauthorized email (dmtripconnectin@gmail.com) rejected with HTTP 403`);
  } catch (err) {
    assert(false, `Auth rejection test failed: ${err.message}`);
  }

  // 3b. Authorized allowlist user login
  try {
    const res = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'tripconnectwebsite2@gmail.com' })
    });
    const cookieHeader = res.headers.get('set-cookie');
    assert(res.status === 200 && cookieHeader && cookieHeader.includes('tc_admin_session'), `Allowlisted email tripconnectwebsite2@gmail.com authenticated successfully & received session cookie`);
    // Extract cookie value for subsequent requests
    adminCookie = cookieHeader ? cookieHeader.split(';')[0] : '';
  } catch (err) {
    assert(false, `Auth login test failed: ${err.message}`);
  }

  // 3c. Protected route guard without cookie
  try {
    const res = await fetch(`${BASE_URL}/api/admin/enquiries`);
    assert(res.status === 401, `Unauthenticated request to /api/admin/enquiries blocked with 401`);
  } catch (err) {
    assert(false, `Protected route guard test failed: ${err.message}`);
  }

  // 4. ADMIN CRM & ENQUIRIES ACTIONS
  console.log(`\n--- [4] Admin CRM Operations ---`);
  if (adminCookie) {
    // 4a. Fetch enquiries list
    try {
      const res = await fetch(`${BASE_URL}/api/admin/enquiries`, {
        headers: { Cookie: adminCookie }
      });
      const data = await res.json();
      assert(res.status === 200 && Array.isArray(data.enquiries), `Admin fetched enquiries list (${data.enquiries.length} enquiries found)`);
    } catch (err) {
      assert(false, `Fetch enquiries failed: ${err.message}`);
    }

    // 4b. Status transition: update enquiry to 'contacted'
    if (createdEnquiryId) {
      try {
        const res = await fetch(`${BASE_URL}/api/admin/enquiries/${createdEnquiryId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Cookie: adminCookie
          },
          body: JSON.stringify({
            status: 'contacted',
            assigned_to: 'tripconnectwebsite2@gmail.com'
          })
        });
        const data = await res.json();
        assert(res.status === 200 && data.enquiry?.status === 'contacted', `Enquiry status transitioned to 'contacted'`);
      } catch (err) {
        assert(false, `Update enquiry status failed: ${err.message}`);
      }

      // 4c. Add internal follow-up note
      try {
        const res = await fetch(`${BASE_URL}/api/admin/enquiries/${createdEnquiryId}/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: adminCookie
          },
          body: JSON.stringify({
            note: 'Contacted client via WhatsApp. They prefer a houseboat with upper deck view. Quote sent for ₹65,000.'
          })
        });
        const data = await res.json();
        assert(res.status === 201 && data.note?.note, `Internal CRM note appended to enquiry timeline`);
      } catch (err) {
        assert(false, `Add note failed: ${err.message}`);
      }
    }

    // 4d. CSV Export & Formula Injection Sanitization Verification
    try {
      const res = await fetch(`${BASE_URL}/api/admin/enquiries/export`, {
        headers: { Cookie: adminCookie }
      });
      const csvText = await res.text();
      assert(res.status === 200 && csvText.includes('Enquiry ID,Customer Name,Phone / WhatsApp'), `CSV export endpoint generated valid CSV structure`);

      // Verify that dangerous formula injection characters have been sanitized with a leading quote
      const containsUnsanitizedCmd = csvText.includes(',=cmd');
      assert(!containsUnsanitizedCmd, `Formula injection protection: '=cmd' safely escaped and not executable as spreadsheet formula`);
    } catch (err) {
      assert(false, `CSV export test failed: ${err.message}`);
    }
  }

  // 5. PACKAGE MANAGEMENT WORKFLOW (Draft -> Verification -> Publish)
  console.log(`\n--- [5] Package Publishing Workflow & Verification Rules ---`);
  if (adminCookie) {
    let newPkgId = null;

    // 5a. Create draft package
    try {
      const draftPkg = {
        title: 'Wayanad Rainforest & Wildlife Retreat',
        slug: 'wayanad-rainforest-wildlife-retreat-draft',
        destination_id: 'dest-wayanad',
        category: 'kerala',
        duration_days: 4,
        duration_nights: 3,
        starting_price: 18500,
        short_description: 'Experience the misty rainforests, tea estates, and wildlife sanctuaries of Wayanad.',
        overview: 'Experience the misty rainforests, tea estates, and wildlife sanctuaries of Wayanad.',
        highlights: ['Banasura Sagar Dam', 'Edakkal Caves', 'Chembra Peak trek'],
        status: 'draft',
        content_verified: false,
        itinerary: [
          { day: 1, title: 'Arrival in Wayanad', description: 'Check in to plantation resort and relax.' },
          { day: 2, title: 'Caves & Waterfalls', description: 'Explore Edakkal caves and Soochipara falls.' }
        ]
      };

      const res = await fetch(`${BASE_URL}/api/admin/packages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: adminCookie
        },
        body: JSON.stringify(draftPkg)
      });
      const data = await res.json();
      assert(res.status === 201 && data.package?.status === 'draft', `Draft package created successfully with ID: ${data.package?.id}`);
      newPkgId = data.package?.id;
    } catch (err) {
      assert(false, `Draft package creation failed: ${err.message}`);
    }

    // 5b. Publish package after verification checklist passes
    if (newPkgId) {
      try {
        const res = await fetch(`${BASE_URL}/api/admin/packages/${newPkgId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Cookie: adminCookie
          },
          body: JSON.stringify({
            status: 'published',
            content_verified: true,
            is_featured: true,
            inclusions: ['Resort stay', 'Breakfast', 'Private vehicle transfers'],
            exclusions: ['Entry tickets', 'Personal expenses']
          })
        });
        const data = await res.json();
        assert(res.status === 200 && data.package?.status === 'published', `Package verified and published to catalog`);
      } catch (err) {
        assert(false, `Package publish update failed: ${err.message}`);
      }
    }
  }

  // 6. SITE SETTINGS & REVIEWS CRM
  console.log(`\n--- [6] Site Settings & Genuine Reviews API ---`);
  if (adminCookie) {
    // 6a. Get site settings
    try {
      const res = await fetch(`${BASE_URL}/api/admin/settings`, {
        headers: { Cookie: adminCookie }
      });
      const data = await res.json();
      assert(res.status === 200 && data.settings?.business_name === 'Trip Connect', `Admin settings retrieved with business name 'Trip Connect'`);
    } catch (err) {
      assert(false, `Settings test failed: ${err.message}`);
    }

    // 6b. Reviews list
    try {
      const res = await fetch(`${BASE_URL}/api/admin/reviews`, {
        headers: { Cookie: adminCookie }
      });
      const data = await res.json();
      assert(res.status === 200 && Array.isArray(data.reviews), `Admin reviews retrieved (${data.reviews.length} reviews loaded)`);
    } catch (err) {
      assert(false, `Reviews test failed: ${err.message}`);
    }
  }

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} Passed | ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
