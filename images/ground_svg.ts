/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="31.65" height="39.72" data-name="Layer 2" viewBox="0 0 31.65 39.72"><path d="M15.83 0v23.48M0 23.48h31.65m-25.9 7.34h20.16m-14.79 7.4h9.41" data-name="Layer 1" style="fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:3px"/></svg>')}`;
export default image;