import MainBrandLogo from "./MainBrandLogo";
import QRCodeGenerator from "./QRCodeGenerator";

const App = () => {
  return (
    <>
      <MainBrandLogo
        logoSrc="/soft-logo.webp"
        mainDomain="soft.io.vn"
        dismissible={false}
        altText="Logo Soft"
      />
      <QRCodeGenerator />
    </>
  );
};

export default App;
