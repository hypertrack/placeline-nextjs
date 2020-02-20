import Document, { Head, Main, NextScript } from "next/document";
import stylesheet from "antd/dist/antd.min.css";

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
