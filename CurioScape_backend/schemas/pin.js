export default {
    name: 'pin',
    title: 'Pin',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
      },
      {
        name: 'about',
        title: 'About',
        type: 'string',
      },
      {
        name: 'destination',
        title: 'Destination',
        type: 'url',//field expects a URL value
      },
      {
        name: 'category',
        title: 'Category',
        type: 'string',
      },
      {
        name: 'image',
        title: 'Image',
        type: 'image',//expects an image value
        options: {
          hotspot: true,//crop option
        },
      },
      {
        name: 'userId',
        title: 'UserId',
        type: 'string',
      },
      {
        name: 'postedBy',
        title: 'PostedBy',
        type: 'postedBy',//reference to another object called 'postedBy'.
      },
      {
        name: 'save',
        title: 'Save',
        type: 'array',
        of: [{ type: 'save' }],//'of' property is reference to another object called 'save'.
      },
      {
        name: 'comments',
        title: 'Comments',
        type: 'array',
        of: [{ type: 'comment' }],//'of' property is referencing another object called 'comment'
      },
    ],
  };