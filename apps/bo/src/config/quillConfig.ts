import ReactQuill from 'react-quill';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module-react';
import React from 'react';

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

// Register line-height style
const Parchment = Quill.import('parchment');
const LineHeightStyle = new Parchment.Attributor.Style('line-height', 'lineHeight', {
  scope: Parchment.Scope.BLOCK,
  whitelist: ['1.0', '1.2', '1.5', '1.8', '2.0']
});
Quill.register(LineHeightStyle, true);

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
  'line-height',
  'color',
  'background',
  'code-block',
  'imagewithstyle',

  'alt',
  'height',
  'width',
  'style',
];

export const createQuillModules = (
  handleImageUpload: () => void,
  quillRef: React.MutableRefObject<ReactQuill | null>,
) => ({
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
      [{ 'line-height': ['1.0', '1.2', '1.5', '1.8', '2.0'] }],
    ],
    handlers: {
      image: handleImageUpload,
      'line-height': function(value) {
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          quill.formatLine(range.index, range.length, {'line-height': value});
        }
      },
    },
  },
  clipboard: {
    matchVisual: false,
  },
  imageResize: {
    parchment: ReactQuill.Quill.import('parchment'),
    modules: ['Resize', 'DisplaySize', 'Toolbar'],
  },
});
