module.exports = ({ env }) => ({
  // The default of 10 silently truncated lists (readers, horoscopes) and
  // nested relations (a section's testimonials) in frontend queries.
  graphql: {
    config: {
      defaultLimit: 100,
      maxLimit: 500,
    },
  },
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("SMTP_HOST"),
        port: env.int("SMTP_PORT", 587),
        secure: env.bool("SMTP_SECURE", false),
        auth: {
          user: env("SMTP_USERNAME"),
          pass: env("SMTP_PASSWORD"),
        },
      },
      settings: {
        defaultFrom: env("SMTP_FROM"),
        defaultReplyTo: env("SMTP_FROM"),
      },
    },
  },
});
