import BACKGROUND from './backgrounds/background.jpg';
import ICON_SVG from './icons/SvgIcon.svg';

const IMAGES = {
    SVG: {
        BACKGROUND,
        ICON_SVG,
    },
    OTHERS : {
        BACKGROUND : require('./backgrounds/background.webp'),
        ICON_PNG : require('./icons/PngIcon.png'),
        ICON_JPG : require('./icons/JpgIcon.jpg'),
        ICON_WEBP : require('./icons/WebpIcon.webp'),
    }
};
export default IMAGES;