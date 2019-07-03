import Document, { Head, Main, NextScript } from 'next/document';

// Import styled components ServerStyleSheet
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    // Step 1: Create an instance of ServerStyleSheet
    const sheet = new ServerStyleSheet();

    // Step 2: Retrieve styles from components in the page
    const page = renderPage((App) => (props) =>
      sheet.collectStyles(<App {...props} />),
    );

    // Step 3: Extract the styles as <style> tags
    const styleTags = sheet.getStyleElement();

    // Step 4: Pass styleTags as a prop
    return { ...page, styleTags };
  }

  render() {
    return (
      <html>
        <Head>
        <title>HT Sample Frontend</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta charSet='utf-8' />
        <link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/antd/3.19.8/antd.min.css' />
          {this.props.styleTags}
        </Head>
        <body>
            <Main />
            <NextScript />
        </body>
      </html>
    );
  }
}