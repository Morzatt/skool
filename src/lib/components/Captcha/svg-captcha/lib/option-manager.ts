import opentype from "opentype.js"
import charPreset from "./char-preset";

export const font = opentype.loadSync("./src/lib/components/Captcha/svg-captcha/fonts/mom_t.ttf");
export const ascender = font.ascender;
export const descender = font.descender;

export const options = {
	width: 150,
	height: 50,
	noise: 1,
	color: false,
	background: '',
	size: 4,
	ignoreChars: '',
	fontSize: 56,
	charPreset, font, ascender, descender
};

export const loadFont = filepath => {
	const font = opentype.loadSync(filepath);
	options.font = font;
	options.ascender = font.ascender;
	options.descender = font.descender;
};

export default {
	options, loadFont
};
