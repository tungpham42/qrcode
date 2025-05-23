import React, { useState, useEffect, createContext, useMemo } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { QRCodeSVG } from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQrcode,
  faGlobe,
  faPalette,
  faArrowsAlt,
  faWifi,
  faEnvelope,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

const translations = {
  en: {
    title: "QR Code Generator",
    subtitle: "Create custom QR codes in seconds",
    qrType: "QR Code Type",
    url: "URL",
    text: "Text",
    wifi: "Wi-Fi",
    email: "Email",
    ssid: "Network Name (SSID)",
    password: "Password",
    encryption: "Encryption Type",
    emailAddress: "Email Address",
    subject: "Subject",
    body: "Message Body",
    qrSize: "QR Code Size",
    fgColor: "Foreground Color",
    bgColor: "Background Color",
    generate: "Generate QR Code",
    yourQR: "Your QR Code",
    download: "Download QR Code",
    customize: "Customize Appearance",
    placeholderUrl: "https://example.com",
    placeholderText: "Enter your text here",
    placeholderSSID: "Enter network name",
    placeholderPassword: "Enter password",
    placeholderEmail: "example@domain.com",
    placeholderSubject: "Enter email subject",
    placeholderBody: "Enter email body",
  },
  vi: {
    title: "Trình Tạo Mã QR",
    subtitle: "Tạo mã QR tùy chỉnh trong vài giây",
    qrType: "Loại Mã QR",
    url: "Liên Kết",
    text: "Văn Bản",
    wifi: "Wi-Fi",
    email: "Thư Điện Tử",
    ssid: "Tên Mạng (SSID)",
    password: "Mật Khẩu",
    encryption: "Loại Mã Hóa",
    emailAddress: "Địa Chỉ Email",
    subject: "Chủ Đề",
    body: "Nội Dung Thư",
    qrSize: "Kích Thước Mã QR",
    fgColor: "Màu Nền Trước",
    bgColor: "Màu Nền Sau",
    generate: "Tạo Mã QR",
    yourQR: "Mã QR Của Bạn",
    download: "Tải Xuống",
    customize: "Tùy Chỉnh Giao Diện",
    placeholderUrl: "https://example.com",
    placeholderText: "Nhập văn bản tại đây",
    placeholderSSID: "Nhập tên mạng",
    placeholderPassword: "Nhập mật khẩu",
    placeholderEmail: "ten@mien.com",
    placeholderSubject: "Nhập chủ đề email",
    placeholderBody: "Nhập nội dung email",
  },
};

const LanguageContext = createContext("vi");

const QRCodeGenerator = () => {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "vi");
  const [type, setType] = useState("url");
  const [formData, setFormData] = useState({
    url: "",
    text: "",
    ssid: "",
    password: "",
    encryption: "WPA",
    email: "",
    subject: "",
    body: "",
  });
  const [qrData, setQrData] = useState("");
  const [qrSize, setQrSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isGenerated, setIsGenerated] = useState(false);

  const t = useMemo(() => translations[lang], [lang]);

  useEffect(() => localStorage.setItem("lang", lang), [lang]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const generateQR = () => {
    const { url, text, ssid, password, encryption, email, subject, body } =
      formData;
    const data =
      {
        url,
        text,
        wifi: `WIFI:T:${encryption};S:${ssid};P:${password};;`,
        email: `mailto:${email}?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`,
      }[type] || "";
    setQrData(data);
    setIsGenerated(true);
  };

  const downloadQR = () => {
    const svg = document.getElementById("qr-code");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QRCode-${new Date().getTime()}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <LanguageContext.Provider value={lang}>
      <Container className="my-5" style={{ maxWidth: "900px" }}>
        <Card className="mb-4">
          <Card.Header>
            <div className="header-content">
              <div className="header-text">
                <h2 className="mb-1">
                  <FontAwesomeIcon icon={faQrcode} className="me-2" />
                  {t.title}
                </h2>
                <p className="text-muted mb-0">{t.subtitle}</p>
              </div>
              <div className="language-select-container">
                <Form.Select
                  className="language-select shadow-sm"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                >
                  <option value="vi">
                    <FontAwesomeIcon icon={faGlobe} className="me-2" />
                    Tiếng Việt
                  </option>
                  <option value="en">
                    <FontAwesomeIcon icon={faGlobe} className="me-2" />
                    English
                  </option>
                </Form.Select>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Group as={Row} className="mb-4">
                <Form.Label column sm={3} className="d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faQrcode}
                    className="me-2 text-primary"
                  />
                  {t.qrType}
                </Form.Label>
                <Col sm={9}>
                  <Form.Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="shadow-sm"
                  >
                    <option value="url">🔗 {t.url}</option>
                    <option value="text">📝 {t.text}</option>
                    <option value="wifi">📶 {t.wifi}</option>
                    <option value="email">✉️ {t.email}</option>
                  </Form.Select>
                </Col>
              </Form.Group>

              {type === "url" && (
                <Form.Group as={Row} className="mb-4">
                  <Form.Label column sm={3}>
                    {t.url}
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      placeholder={t.placeholderUrl}
                      className="shadow-sm"
                    />
                  </Col>
                </Form.Group>
              )}

              {type === "text" && (
                <Form.Group as={Row} className="mb-4">
                  <Form.Label column sm={3}>
                    {t.text}
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      as="textarea"
                      name="text"
                      value={formData.text}
                      onChange={handleChange}
                      rows={4}
                      placeholder={t.placeholderText}
                      className="shadow-sm"
                    />
                  </Col>
                </Form.Group>
              )}

              {type === "wifi" && (
                <>
                  <Form.Group as={Row} className="mb-4">
                    <Form.Label
                      column
                      sm={3}
                      className="d-flex align-items-center"
                    >
                      <FontAwesomeIcon
                        icon={faWifi}
                        className="me-2 text-primary"
                      />
                      {t.ssid}
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        name="ssid"
                        value={formData.ssid}
                        onChange={handleChange}
                        placeholder={t.placeholderSSID}
                        className="shadow-sm"
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-4">
                    <Form.Label column sm={3}>
                      {t.password}
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder={t.placeholderPassword}
                        className="shadow-sm"
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-4">
                    <Form.Label column sm={3}>
                      {t.encryption}
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        name="encryption"
                        value={formData.encryption}
                        onChange={handleChange}
                        className="shadow-sm"
                      >
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">None</option>
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </>
              )}

              {type === "email" && (
                <>
                  <Form.Group as={Row} className="mb-4">
                    <Form.Label
                      column
                      sm={3}
                      className="d-flex align-items-center"
                    >
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="me-2 text-primary"
                      />
                      {t.emailAddress}
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t.placeholderEmail}
                        className="shadow-sm"
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-4">
                    <Form.Label column sm={3}>
                      {t.subject}
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder={t.placeholderSubject}
                        className="shadow-sm"
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-4">
                    <Form.Label column sm={3}>
                      {t.body}
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        as="textarea"
                        name="body"
                        value={formData.body}
                        onChange={handleChange}
                        rows={4}
                        placeholder={t.placeholderBody}
                        className="shadow-sm"
                      />
                    </Col>
                  </Form.Group>
                </>
              )}

              <div className="mb-4 p-4 bg-light rounded-lg">
                <h5 className="mb-3 d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faPalette}
                    className="me-2 text-primary"
                  />
                  {t.customize}
                </h5>
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="d-flex align-items-center">
                        <FontAwesomeIcon
                          icon={faArrowsAlt}
                          className="me-2 text-muted"
                        />
                        {t.qrSize}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={qrSize}
                        onChange={(e) => setQrSize(parseInt(e.target.value))}
                        min={100}
                        max={500}
                        placeholder="256"
                        className="shadow-sm"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>{t.fgColor}</Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="color"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="shadow-sm"
                          style={{
                            width: "90px",
                            height: "50px",
                            cursor: "pointer",
                          }}
                        />
                        <span className="ms-2">{fgColor}</span>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>{t.bgColor}</Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="shadow-sm"
                          style={{
                            width: "90px",
                            height: "50px",
                            cursor: "pointer",
                          }}
                        />
                        <span className="ms-2">{bgColor}</span>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </div>

              <div className="text-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={generateQR}
                  className="px-5 py-3"
                >
                  <FontAwesomeIcon icon={faQrcode} className="me-2" />
                  {t.generate}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {isGenerated && (
          <Card className="text-center">
            <Card.Header>
              <h4 className="mb-0">
                <FontAwesomeIcon icon={faQrcode} className="me-2" />
                {t.yourQR}
              </h4>
            </Card.Header>
            <Card.Body>
              <div className="qr-container mb-4">
                <QRCodeSVG
                  id="qr-code"
                  value={qrData}
                  size={qrSize}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={downloadQR}
                className="px-5 py-3"
              >
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                {t.download}
              </Button>
            </Card.Body>
          </Card>
        )}
      </Container>
    </LanguageContext.Provider>
  );
};

export default QRCodeGenerator;
