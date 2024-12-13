import * as React from "react";
import Svg, { Path } from "react-native-svg";
import SvgImage from "react-native-svg/lib/typescript/elements/Image";

const EmailSVG = (props: SvgImage) => (
  <Svg
    width={30}
    height={30}
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M25.3,30.2L37.5,22.4L37.5,25.3L25.3,33Z"
      fill="#4DE0F9"
    />
    <Path
      d="M35.3,25.4L32.6,27.1L32.6,11L35.3,11Z"
      fill="#4DE0F9"
    />
    <Path
      d="M25.3,38.9H41.4V42.8H25.3Z"
      fill="#4DE0F9"
    />
    <Path
      d="M37.2,26.9L41.4,24.1L41.4,42.8L37.2,42.8Z"
      fill="#4DE0F9"
    />
    <Path
      d="M40.5,41.7H10V41.7V22.5L11.2,22.5V40.5H39.3V22.5H40.5Z"
      fill="#0D5FC3"
    />
    <Path
      d="M25.3,32.4L10.3,23C10.1,22.9,9.9,22.7,9.9,22.5C9.9,22.3,10.1,22.1,10.3,22L16,18.4L16.6,19.4L11.7,22.5L25.3,31L39,23L34.1,20.3L34.7,19.3L39,22L25.3,32.4Z"
      fill="#0D5FC3"
    />
    <Path
      d="M12.8,34.7V31.8H12.8V34.7Z"
      fill="#4DE0F9"
    />
    <Path
      d="M12.8,31.8H12.8V34.7H12.8Z"
      fill="#4DE0F9"
    />
    <Path
      d="M34.8,26.2L33.6,26.2L33.6,9.8L17,9.8L17,26L15.8,26L15.8,8.6L34.8,8.6Z"
      fill="#0D5FC3"
    />
    <Path
      d="M25.3,32.5L19.6,29L20.3,27.9L25.3,31.1L30.5,27.8L31.2,28.8Z"
      fill="#0D5FC3"
    />
    <Path
      d="M28.8,22.9H27.3C26.8,22.9,26.3,22.5,26.3,22V20.7C26.3,20.2,26.7,19.8,27.2,19.8H29.7C30.2,19.8,30.6,20.2,30.6,20.7V22H31.7V15H25.1V21.6H25V22.8H21.7C21.2,22.8,20.8,22.4,20.8,21.9V14.8C20.8,14.3,21.2,13.9,21.7,13.9H28.8C29.3,13.9,29.7,14.3,29.7,14.8V22.8C29.7,22.4,29.3,22.9,28.8,22.9Z"
      fill="#0D5FC3"
    />
  </Svg>
);

export default EmailSVG;
