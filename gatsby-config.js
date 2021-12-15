module.exports = {
  pathPrefix: '/',
  // Since `gatsby-plugin-typescript` is automatically included in Gatsby you
  // don't need to define it here (just if you need to change the options)
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`, // Needed for dynamic images
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Connect Metamask`,
        short_name: `connectMetamask`,
        start_url: `/`,
        background_color: `#fffff`,
        theme_color: `#00000`,
        display: `standalone`,
        icon: './static/svg/logo.svg',
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-postcss`,
  ],
};
