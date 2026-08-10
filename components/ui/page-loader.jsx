// "use client";


// export default function PageLoader() {
//   return (
//     <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-xl">
//       <div className="relative flex flex-col items-center gap-4">

//         <p className="text-sm font-medium text-white/80 tracking-wide">
//           Loading portfolio...
//         </p>
//       </div>
//     </div>
//   );
// }


import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-xl">
      <StyledWrapper>
        <div className="loader" />
      </StyledWrapper>
    </div>
  );
}

const StyledWrapper = styled.div`
  /* HTML: <div class="loader"></div> */
  .loader {
    display: inline-flex;
    border: 10px solid #fff;
    border-radius: 5px;
  }
  .loader::before,
  .loader::after {
    content: "0 1 2 3 4 5 6 7 8 9 0";
    font-size: 30px;
    font-family: monospace;
    font-weight: bold;
    line-height: 1em;
    height: 1em;
    width: 1.2ch;
    text-align: center;
    outline: 1px solid #fff;
    color: #0000;
    text-shadow: 0 0 0 #fff;
    overflow: hidden;
    animation: l4 2s infinite linear;
  }
  .loader::before {
    animation-duration: 4s;
  }
  @keyframes l4 {
    100% {
      text-shadow: 0 var(--t, -10em) 0 #fff;
    }
  }`;

export default Loader;
