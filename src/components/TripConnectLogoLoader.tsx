import React from "react";

interface TripConnectLogoLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "fullscreen";
}

export default function TripConnectLogoLoader({
  className = "",
  size = "fullscreen",
}: TripConnectLogoLoaderProps) {
  const sizeClasses = {
    sm: "w-[240px] max-w-[85vw]",
    md: "w-[420px] max-w-[85vw]",
    lg: "w-[560px] max-w-[90vw]",
    fullscreen: "w-[min(82vw,560px)]",
  }[size];

  return (
    <div
      className={`grid place-items-center bg-transparent select-none ${className}`}
      aria-label="Trip Connect Kochi loading"
    >
      <div className={`loader ${sizeClasses} flex flex-col items-center justify-center`}>
        <style dangerouslySetInnerHTML={{ __html: `
          .tc-logo-svg {
            display: block;
            width: 100%;
            height: auto;
            overflow: visible;
          }
          .tc-logo-path {
            fill: #000;
            fill-opacity: 0;
            stroke: #000;
            stroke-width: 1.25;
            stroke-linejoin: round;
            stroke-linecap: round;
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            animation:
              tc-draw-line 2.25s cubic-bezier(.4,0,.2,1) forwards,
              tc-reveal-fill .45s ease-out forwards;
            animation-delay: calc(var(--i) * 0.075s), calc(1.45s + var(--i) * 0.075s);
            animation-iteration-count: infinite, infinite;
            animation-duration: 3.6s, 3.6s;
            animation-timing-function: cubic-bezier(.4,0,.2,1), ease-out;
            animation-fill-mode: both, both;
          }
          @media (prefers-color-scheme: dark) {
            .tc-logo-path {
              fill: #ffffff;
              stroke: #ffffff;
            }
          }
          .dark .tc-logo-path {
            fill: #ffffff;
            stroke: #ffffff;
          }
          .tc-logo-path:nth-of-type(1) { --i: 0; }
          .tc-logo-path:nth-of-type(2) { --i: 1; }
          .tc-logo-path:nth-of-type(3) { --i: 2; }
          .tc-logo-path:nth-of-type(4) { --i: 3; }
          .tc-logo-path:nth-of-type(5) { --i: 4; }
          .tc-logo-path:nth-of-type(6) { --i: 5; }
          .tc-logo-path:nth-of-type(7) { --i: 6; }
          .tc-logo-path:nth-of-type(8) { --i: 7; }
          .tc-logo-path:nth-of-type(9) { --i: 8; }
          .tc-logo-path:nth-of-type(10) { --i: 9; }
          .tc-logo-path:nth-of-type(11) { --i: 10; }
          .tc-logo-path:nth-of-type(12) { --i: 11; }
          .tc-logo-path:nth-of-type(13) { --i: 12; }
          .tc-logo-path:nth-of-type(14) { --i: 13; }
          .tc-logo-path:nth-of-type(15) { --i: 14; }
          .tc-logo-path:nth-of-type(16) { --i: 15; }
          .tc-logo-path:nth-of-type(17) { --i: 16; }
          .tc-logo-path:nth-of-type(18) { --i: 17; }
          .tc-logo-path:nth-of-type(19) { --i: 18; }
          .tc-logo-path:nth-of-type(20) { --i: 19; }
          .tc-logo-path:nth-of-type(21) { --i: 20; }
          .tc-logo-path:nth-of-type(22) { --i: 21; }
          .tc-logo-path:nth-of-type(23) { --i: 22; }
          @keyframes tc-draw-line {
            to { stroke-dashoffset: 0; }
          }
          @keyframes tc-reveal-fill {
            to { fill-opacity: 1; }
          }
          @media (prefers-reduced-motion: reduce) {
            .tc-logo-path { animation: none; stroke-dashoffset: 0; fill-opacity: 1; }
          }
        `}} />

        <svg
          className="tc-logo-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 909 319"
          role="img"
          aria-label="Trip Connect Kochi logo"
        >
          <g fill="#000000" fillRule="evenodd" clipRule="evenodd">
            <path className="tc-logo-path" pathLength={1} d="M 867 294 L 862 295 L 862 299 L 859 308 L 859 314 L 861 315 L 864 314 L 868 296 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 843 294 L 841 297 L 841 304 L 839 308 L 839 314 L 843 314 L 845 310 L 845 307 L 848 305 L 851 307 L 850 314 L 852 315 L 856 311 L 858 295 L 854 294 L 853 299 L 851 301 L 848 301 L 846 299 L 847 295 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 837 294 L 830 294 L 823 301 L 823 309 L 829 315 L 832 315 L 836 313 L 837 311 L 836 310 L 831 310 L 828 308 L 828 304 L 832 299 L 838 299 L 839 298 L 839 295 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 816 294 L 809 294 L 805 296 L 802 301 L 802 311 L 807 315 L 814 314 L 819 309 L 821 305 L 821 300 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 813 299 L 815 301 L 814 308 L 809 310 L 807 308 L 807 303 L 810 299 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 787 294 L 785 296 L 784 308 L 782 314 L 786 315 L 790 308 L 793 312 L 793 314 L 797 315 L 798 311 L 795 304 L 800 298 L 801 295 L 797 294 L 792 299 L 791 295 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 904 197 L 854 197 L 853 198 L 846 197 L 844 199 L 844 202 L 842 205 L 841 217 L 858 217 L 859 218 L 856 229 L 856 235 L 853 244 L 853 249 L 851 254 L 850 265 L 848 268 L 846 283 L 868 283 L 869 282 L 873 261 L 875 257 L 876 247 L 879 238 L 882 219 L 884 217 L 901 217 L 905 203 L 905 198 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 710 197 L 707 204 L 706 216 L 704 219 L 703 229 L 700 237 L 700 243 L 698 248 L 697 259 L 695 264 L 694 274 L 692 278 L 692 283 L 743 283 L 746 271 L 746 265 L 745 264 L 721 264 L 720 260 L 723 249 L 746 249 L 748 247 L 751 231 L 750 230 L 727 230 L 726 229 L 727 219 L 729 216 L 756 216 L 758 209 L 759 197 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 617 197 L 615 199 L 613 206 L 611 220 L 608 230 L 607 241 L 605 245 L 604 255 L 602 260 L 598 283 L 600 284 L 601 283 L 619 283 L 623 267 L 628 233 L 630 227 L 646 282 L 647 283 L 672 283 L 674 279 L 675 269 L 677 265 L 680 247 L 683 239 L 684 228 L 686 224 L 686 219 L 689 210 L 690 197 L 670 197 L 665 218 L 660 248 L 658 250 L 643 199 L 641 197 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 522 198 L 505 283 L 526 283 L 530 266 L 531 256 L 534 246 L 535 234 L 537 229 L 553 283 L 579 283 L 584 265 L 587 246 L 590 236 L 591 225 L 593 220 L 593 215 L 597 199 L 595 197 L 577 197 L 576 198 L 574 212 L 572 216 L 571 228 L 569 232 L 568 243 L 565 250 L 557 226 L 557 223 L 554 217 L 549 198 L 547 197 L 524 197 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 412 200 L 403 197 L 382 197 L 378 198 L 376 200 L 371 201 L 364 206 L 353 219 L 349 228 L 349 232 L 347 235 L 346 259 L 350 271 L 359 280 L 370 284 L 383 285 L 389 283 L 394 283 L 402 280 L 404 278 L 404 260 L 398 263 L 390 264 L 386 266 L 376 264 L 373 262 L 369 255 L 369 243 L 371 239 L 372 232 L 375 226 L 385 217 L 396 216 L 411 222 L 411 220 L 413 218 L 418 206 L 418 204 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 824 198 L 814 196 L 803 196 L 794 198 L 792 200 L 787 201 L 781 205 L 770 217 L 764 231 L 763 244 L 762 245 L 762 255 L 763 256 L 763 262 L 767 271 L 776 280 L 782 283 L 796 285 L 797 284 L 804 284 L 813 282 L 819 279 L 820 261 L 819 260 L 814 263 L 804 264 L 803 265 L 796 265 L 791 263 L 788 260 L 786 255 L 786 240 L 790 228 L 794 222 L 801 217 L 814 216 L 823 219 L 825 221 L 828 221 L 835 204 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 478 197 L 462 196 L 452 198 L 450 200 L 445 201 L 433 212 L 425 225 L 421 239 L 421 261 L 427 274 L 438 282 L 451 285 L 470 282 L 479 277 L 489 267 L 494 259 L 500 238 L 499 219 L 496 211 L 491 204 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 470 216 L 476 223 L 476 237 L 472 252 L 469 258 L 464 263 L 459 265 L 450 264 L 445 259 L 444 256 L 444 242 L 447 231 L 453 221 L 460 216 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 312 201 L 306 198 L 296 197 L 295 196 L 267 196 L 266 197 L 262 213 L 259 233 L 256 243 L 256 248 L 254 253 L 253 264 L 251 267 L 251 272 L 249 279 L 250 282 L 271 282 L 276 262 L 276 258 L 279 253 L 295 252 L 301 250 L 311 244 L 315 239 L 320 229 L 320 212 L 317 206 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 294 215 L 298 220 L 295 229 L 290 233 L 283 234 L 282 230 L 285 216 L 287 214 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 246 196 L 225 196 L 223 199 L 220 217 L 218 221 L 217 233 L 215 237 L 214 248 L 212 252 L 211 262 L 208 271 L 208 276 L 207 277 L 208 282 L 229 282 L 230 281 L 234 259 L 236 254 L 236 248 L 240 233 L 240 228 L 245 209 L 245 204 L 247 198 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 146 197 L 136 245 L 136 250 L 134 254 L 134 260 L 131 270 L 130 282 L 150 282 L 152 281 L 157 253 L 159 250 L 163 251 L 164 256 L 166 258 L 166 261 L 176 282 L 198 282 L 199 279 L 194 270 L 194 268 L 192 266 L 189 256 L 184 247 L 184 245 L 196 235 L 200 227 L 200 212 L 198 207 L 192 201 L 187 198 L 182 197 L 174 197 L 173 196 L 151 196 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 174 215 L 177 219 L 176 227 L 168 233 L 163 233 L 162 231 L 164 227 L 165 216 L 167 214 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 133 196 L 93 196 L 92 197 L 77 197 L 76 196 L 74 197 L 70 214 L 71 215 L 82 215 L 88 217 L 86 221 L 85 232 L 83 236 L 82 246 L 80 250 L 79 261 L 77 264 L 77 270 L 74 279 L 75 282 L 96 282 L 98 280 L 99 272 L 102 263 L 102 258 L 104 254 L 105 244 L 107 240 L 108 230 L 110 226 L 111 217 L 121 215 L 127 215 L 128 216 L 130 215 L 134 200 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 265 104 L 266 106 L 272 109 L 278 114 L 297 123 L 301 126 L 318 132 L 323 135 L 338 139 L 341 141 L 393 153 L 407 154 L 422 157 L 432 157 L 441 159 L 457 159 L 458 160 L 538 159 L 539 158 L 550 158 L 551 157 L 566 157 L 567 156 L 576 156 L 577 155 L 587 155 L 588 154 L 605 153 L 621 150 L 630 150 L 638 148 L 659 147 L 665 145 L 688 144 L 695 142 L 708 142 L 709 141 L 778 141 L 779 142 L 796 142 L 801 144 L 810 144 L 811 145 L 818 145 L 824 147 L 836 148 L 841 150 L 846 150 L 856 153 L 865 154 L 883 160 L 897 163 L 892 159 L 887 158 L 868 150 L 861 149 L 849 144 L 842 143 L 839 141 L 830 140 L 813 135 L 801 134 L 796 132 L 777 131 L 770 129 L 745 128 L 744 127 L 732 127 L 731 126 L 676 126 L 675 127 L 627 129 L 626 130 L 617 130 L 616 131 L 586 132 L 578 134 L 547 135 L 546 136 L 536 136 L 535 137 L 452 138 L 451 137 L 433 137 L 432 136 L 422 136 L 421 135 L 412 135 L 411 134 L 399 134 L 384 131 L 374 131 L 368 129 L 356 128 L 351 126 L 340 125 L 336 123 L 326 122 L 323 120 L 314 119 L 311 117 L 304 116 L 291 111 L 284 110 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 25 141 L 25 143 L 52 138 L 58 138 L 79 133 L 86 133 L 87 132 L 93 132 L 108 129 L 116 129 L 117 128 L 126 128 L 127 127 L 187 126 L 188 127 L 212 129 L 213 130 L 219 130 L 225 132 L 231 132 L 247 135 L 309 152 L 281 135 L 246 120 L 239 119 L 237 117 L 207 108 L 201 108 L 192 105 L 184 105 L 174 103 L 161 103 L 160 102 L 122 104 L 121 105 L 103 107 L 95 110 L 88 111 L 56 123 L 54 125 L 38 132 Z"/>
            <path className="tc-logo-path" pathLength={1} d="M 3 74 L 3 76 L 19 84 L 37 90 L 57 94 L 86 95 L 87 94 L 100 94 L 101 93 L 122 91 L 130 88 L 152 84 L 168 79 L 172 79 L 180 76 L 203 71 L 207 69 L 211 69 L 214 67 L 222 66 L 225 64 L 246 60 L 250 58 L 285 51 L 290 51 L 296 49 L 316 47 L 317 46 L 335 45 L 336 44 L 352 43 L 353 42 L 378 41 L 379 40 L 419 40 L 420 41 L 458 43 L 465 45 L 482 46 L 512 52 L 552 64 L 595 82 L 626 99 L 630 100 L 640 107 L 683 108 L 684 109 L 702 109 L 703 110 L 712 110 L 713 111 L 726 111 L 727 112 L 737 112 L 746 114 L 763 115 L 770 117 L 782 118 L 787 120 L 798 121 L 802 123 L 810 124 L 817 127 L 821 127 L 828 130 L 842 133 L 845 135 L 860 139 L 893 154 L 904 162 L 905 161 L 889 147 L 870 135 L 843 123 L 837 122 L 826 117 L 819 116 L 813 113 L 809 113 L 793 108 L 780 107 L 775 105 L 764 104 L 752 101 L 745 101 L 730 98 L 719 98 L 718 97 L 702 96 L 701 95 L 689 95 L 682 93 L 665 92 L 662 90 L 654 89 L 644 84 L 639 83 L 610 68 L 603 63 L 601 63 L 597 60 L 593 59 L 591 57 L 589 57 L 585 54 L 583 54 L 564 44 L 514 24 L 507 23 L 504 21 L 497 20 L 494 18 L 490 18 L 478 14 L 457 11 L 452 9 L 423 6 L 422 5 L 408 5 L 407 4 L 397 4 L 396 3 L 351 3 L 350 4 L 316 6 L 310 8 L 303 8 L 302 9 L 295 9 L 291 11 L 278 12 L 274 14 L 253 18 L 224 27 L 221 29 L 216 30 L 214 32 L 200 36 L 198 38 L 193 39 L 181 45 L 167 50 L 163 53 L 161 53 L 148 60 L 146 60 L 144 62 L 140 63 L 138 65 L 134 66 L 132 68 L 104 78 L 91 81 L 65 83 L 64 82 L 32 80 L 27 78 L 14 77 Z"/>
          </g>
        </svg>
      </div>
    </div>
  );
}
