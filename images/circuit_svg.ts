/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" id="Layer_2" width="54.01" height="12.08" data-name="Layer 2" viewBox="0 0 54.01 12.08"><defs><style>.cls-1{fill:none;stroke:#020202;stroke-miterlimit:10;stroke-width:2px}</style></defs><g id="Layer_1-2" data-name="Layer 1"><path d="m18.44 1.2 17.3 9.59" class="cls-1"/><circle cx="17.05" cy="6.04" r="5.04" class="cls-1"/><path d="M54.01 6.04H42.45m-30.89 0H0" class="cls-1"/><circle cx="37.41" cy="6.04" r="5.04" class="cls-1"/></g></svg>')}`;
export default image;