import style from '@/common/style/variable.scss';
export const stylesMixin = {
    data() {
        return {
            styleVariable: style,
        };
    }
};

import { fileUrl } from '@/common/js/config';
export const backgroundImageMixin = {
    data() {
        return {
            backgroundImage: fileUrl + 'background_image.png!d1',
        };
    }
};