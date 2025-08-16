import type { Schema, Struct } from '@strapi/strapi';

export interface BlogsRelatedArticles extends Struct.ComponentSchema {
  collectionName: 'components_blogs_related_articles';
  info: {
    displayName: 'Related Articles';
  };
  attributes: {
    blogs: Schema.Attribute.Relation<'oneToMany', 'api::blog.blog'>;
    content: Schema.Attribute.RichText;
    title: Schema.Attribute.String;
  };
}

export interface PreachersFounders extends Struct.ComponentSchema {
  collectionName: 'components_preachers_founders';
  info: {
    displayName: 'Founders';
  };
  attributes: {
    marquee: Schema.Attribute.String;
    preachers: Schema.Attribute.Relation<'oneToMany', 'api::preacher.preacher'>;
  };
}

export interface PreachersPreachers extends Struct.ComponentSchema {
  collectionName: 'components_preachers_preachers';
  info: {
    displayName: 'Preachers';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    marquee: Schema.Attribute.String;
    preachers: Schema.Attribute.Relation<'oneToMany', 'api::preacher.preacher'>;
    title: Schema.Attribute.String;
  };
}

export interface ServicesServices extends Struct.ComponentSchema {
  collectionName: 'components_services_services';
  info: {
    displayName: 'Services';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    marquee: Schema.Attribute.String;
    services: Schema.Attribute.Relation<'oneToMany', 'api::service.service'>;
    title: Schema.Attribute.String;
  };
}

export interface UiBanner extends Struct.ComponentSchema {
  collectionName: 'components_ui_banners';
  info: {
    displayName: 'Banner';
  };
  attributes: {
    backdrop: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    content: Schema.Attribute.RichText;
    title: Schema.Attribute.String;
  };
}

export interface UiFaqs extends Struct.ComponentSchema {
  collectionName: 'components_ui_faqs';
  info: {
    displayName: 'Faqs';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    faqs: Schema.Attribute.Component<'ui.faqs-entry', true>;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface UiFaqsEntry extends Struct.ComponentSchema {
  collectionName: 'components_ui_faqs_entries';
  info: {
    displayName: 'Faqs Entry';
  };
  attributes: {
    answer: Schema.Attribute.Text;
    question: Schema.Attribute.String;
  };
}

export interface UiIntro extends Struct.ComponentSchema {
  collectionName: 'components_ui_intros';
  info: {
    displayName: 'Intro';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    images: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
  };
}

export interface UiLink extends Struct.ComponentSchema {
  collectionName: 'components_ui_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    href: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface UiSection extends Struct.ComponentSchema {
  collectionName: 'components_ui_sections';
  info: {
    displayName: 'Section';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface UiTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_ui_testimonials';
  info: {
    displayName: 'Testimonials';
  };
  attributes: {
    background: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    content: Schema.Attribute.RichText;
    testimonials: Schema.Attribute.Relation<
      'oneToMany',
      'api::testimonial.testimonial'
    >;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blogs.related-articles': BlogsRelatedArticles;
      'preachers.founders': PreachersFounders;
      'preachers.preachers': PreachersPreachers;
      'services.services': ServicesServices;
      'ui.banner': UiBanner;
      'ui.faqs': UiFaqs;
      'ui.faqs-entry': UiFaqsEntry;
      'ui.intro': UiIntro;
      'ui.link': UiLink;
      'ui.section': UiSection;
      'ui.testimonials': UiTestimonials;
    }
  }
}
