'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const highlight_js_1 = __importDefault(require("highlight.js"));
function getHumanReadableSize(size) {
    if (size < 0)
        return 0;
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return ((size / Math.pow(1024, i)).toFixed(i > 2 ? 2 : 0) * 1 +
        '\u00a0' +
        ['B', 'kB', 'MB', 'GB', 'TB'][i]);
}
exports.getHumanReadableSize = getHumanReadableSize;
const fileExtensionPattern = /(?:\.([^.]+))?$/;
function getFileExtension(filename) {
    return fileExtensionPattern.exec(filename)[1];
}
exports.getFileExtension = getFileExtension;
function isAudio(filename) {
    const ext = getFileExtension(filename);
    return ext === 'mp3' || ext === 'ogg' || ext === 'wav';
}
exports.isAudio = isAudio;
function isText(filename) {
    const ext = getFileExtension(filename);
    return ext === 'txt' || String(highlight_js_1.default.getLanguage(ext));
}
exports.isText = isText;
function isImage(filename) {
    const ext = getFileExtension(filename);
    const supportedImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
    return supportedImageTypes.includes(ext.toLowerCase());
}
exports.isImage = isImage;
function isVideo(filename) {
    const ext = getFileExtension(filename);
    return ext === 'mp4' || ext === 'webm' || ext === 'ogv' || ext === 'avi' || ext === 'mkv';
}
exports.isVideo = isVideo;
function toArrayBuffer(buffer) {
    const ab = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}
exports.toArrayBuffer = toArrayBuffer;
function concatUint8Arrays(a, b) {
    const tmp = new Uint8Array(a.length + b.length);
    tmp.set(a);
    tmp.set(b, a.length);
    return tmp;
}
exports.concatUint8Arrays = concatUint8Arrays;
//# sourceMappingURL=file-helpers.js.map