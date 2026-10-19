import { forward } from './_weatherapi.js';

export default function handler(req, res) {
    return forward('current', req, res);
}
