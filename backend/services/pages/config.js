export const pageSchemas = {
  about: {
    table: 'about_pages',
    folder: 'about-pages',
    images: {
      bg_image: { category: 'hero', required: false },
      story_image: { category: 'story', required: false },
      about_image: { category: 'about', required: false },
      team_image: { category: 'team', required: false },
      mission_image: { category: 'mission', required: false },
      vision_image: { category: 'vision', required: false },
      values_image: { category: 'values', required: false }
    },
    requiredFields: [],
    designDefaults: {
      banner_title_text: '#ffffff',
      banner_subtitle_text: '#ffffff',
      // hero_title_size: '36px',
      // hero_subtitle_size: '16px',
      // section_title_size: '28px',
      // body_text_size: '14px',
      // button_text_size: '14px',
      // card_title_size: '18px',
      // hero_height: '500px',
      // section_padding: '80px',
      // card_radius: '4px',
      // button_radius: '4px',
      overlay_opacity: 0.3,
      accent_color: '#1F2937'
    },
    booleanDefaults: {
      // show_video_button: true,
      // show_hero_icons: true,
      // show_feature_icons: true,
      // show_team_photos: true,
      // show_mission_section: true,
      // show_vision_section: true,
      // show_values_section: true,
      // show_hover_effects: true
    }
  },
  landing: {
    table: 'landing_pages',
    folder: 'landing-pages',
    images: {
      bg_image: { category: 'banner', required: false },
      about_image: { category: 'about', required: false },
      text_image: { category: 'impact', required: false },
      image_one: { category: 'triple', required: false },
      image_two: { category: 'triple', required: false },
      image_three: { category: 'triple', required: false }
    },
    requiredFields: [],
    designDefaults: {
      // hero_title_size: '36px',
      // hero_subtitle_size: '16px',
      // section_title_size: '28px',
      // body_text_size: '14px',
      // button_text_size: '14px',
      // card_title_size: '18px',
      // hero_height: '500px',
      // section_padding: '80px',
      // card_radius: '4px',
      // button_radius: '4px',
      overlay_opacity: 0.3,
      accent_color: '#1F2937'
    },
    booleanDefaults: {
      // show_video_button: true,
      // show_hero_icons: true,
      // show_feature_icons: true,
      // show_campaign_badges: true,
      // show_trust_badge: true,
      // show_progress_indicators: true,
      // show_statistics: true,
      // show_hover_effects: true
    }
  },
  header: {
    table: 'header_pages',
    folder: 'header-pages',
    images: {
      logo: { category: 'logo', required: false }
    },
    requiredFields: [],
    designDefaults: {},
    booleanDefaults: {}
  },
  footer: {
    table: 'footer_pages',
    folder: 'footer-pages',
    images: {
      logo: { category: 'logo', required: false }
    },
    requiredFields: [],
    designDefaults: {},
    booleanDefaults: {}
  },
  'donation-page': {
    table: 'donation_pages',
    folder: 'donation-pages',
    images: {
      banner_image: { category: 'banner', required: false },
      small_image: { category: 'small', required: false }
    },
    requiredFields: [],
    isCampaignBased: true,
    designDefaults: {
      bg_color: '#ffffff',
      p_color: '#374151',
      s_color: '#6B7280',
      b1_color: '#3B82F6',
      b2_color: '#10B981',
      b3_color: '#EF4444',
      bt_color: '#ffffff',
      banner_title_color: '#ffffff',
      banner_subtitle_color: '#ffffff',
      // heroTitleSize: '36px',
      // heroSubtitleSize: '18px',
      // sectionTitleSize: '28px',
      // bodyTextSize: '16px',
      // buttonTextSize: '16px',
      // cardTitleSize: '20px',
      // bannerTitleSize: '48px',
      // bannerSubtitleSize: '20px',
      // heroHeight: '500px',
      // sectionPadding: '80px',
      // cardRadius: '8px',
      // buttonRadius: '6px',
      overlay_opacity: 0.4
    },
    booleanDefaults: {
      // show_progress: true,
      // show_donor_count: true,
      // show_days_left: true,
      // show_amount_grid: true
    }
  },
  'donation-form': { 
    table: 'donation_forms',
    folder: 'donation-forms',
    images: {
      bg_image: { category: 'background', required: false }
    },
    requiredFields: [],
    isCampaignBased: true,
    designDefaults: {
      bg_color: '#ffffff',
      p_color: '#374151',
      s_color: '#6B7280',
      t_color: '#111827',
      b1_color: '#3B82F6',
      // heroTitleSize: '32px',
      // sectionTitleSize: '24px',
      // bodyTextSize: '16px',
      // buttonTextSize: '16px',
      // cardRadius: '8px',
      // buttonRadius: '6px'
    },
    booleanDefaults: {}
  },
  'thankyou-page': {
    table: 'thankyou_pages',
    folder: 'thankyou-pages',
    images: {
      bg_image: { category: 'background', required: false }
    },
    requiredFields: [],
    isCampaignBased: true,
    designDefaults: {
      bg_color: '#ffffff',
      p_color: '#374151',
      s_color: '#6B7280'
    },
    booleanDefaults: {}
  }
};


