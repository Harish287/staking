
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <div lang="en">
        <div />
        <div>
          <Main />
          <NextScript />
        </div>
      </div>
    );
  }
}

export default MyDocument;
