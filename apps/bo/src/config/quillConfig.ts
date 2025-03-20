import Quill from 'quill';
import ImageResize from 'quill-image-resize-module-react';
import ReactQuill from 'react-quill';

Quill.register('modules/imageResize', ImageResize);

const ATTRIBUTES = ['alt', 'height', 'width', 'style'];
const ParchmentEmbed = Quill.import('blots/block/embed');
class ImageWithStyle extends ParchmentEmbed {
  static create(value) {
    const node = super.create(value);
    if (typeof value === 'string') {
      node.setAttribute('src', this.sanitize(value));
    }
    return node;
  }

  static formats(domNode) {
    //debugger;
    return ATTRIBUTES.reduce(function (formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  static match(url) {
    return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
  }

  static sanitize(url) {
    return url;
    //return sanitize(url, ['http', 'https', 'data']) ? url : '//:0';
  }

  static value(domNode) {
    // debugger;
    return domNode.getAttribute('src');
  }

  format(name, value) {
    // debugger;
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
ImageWithStyle.blotName = 'imagewithstyle';
ImageWithStyle.tagName = 'IMG';
Quill.register(ImageWithStyle, true);
export const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'align',
  'color',
  'background',
  'code-block',
  'imagewithstyle',

  'alt',
  'height',
  'width',
  'style',
];

ImageWithStyle.blotName = 'imagewithstyle';
ImageWithStyle.tagName = 'IMG';
Quill.register(ImageWithStyle, true);

export const createQuillModules = (handleImageUpload: () => void) => ({
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ['link', 'clean'],
      ['image'],
    ],
    handlers: {
      image: handleImageUpload,
    },
    clipboard: {
      matchVisual: false,
    },
  },
  imageResize: {
    parchment: ReactQuill.Quill.import('parchment'),
    modules: ['Resize', 'DisplaySize', 'Toolbar'],
  },
});
