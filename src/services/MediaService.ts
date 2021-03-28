const soundDing = require('@/views/resources/audio/ding.ogg'); // eslint-disable-line
const soundDing2 = require('@/views/resources/audio/ding2.ogg'); // eslint-disable-line

export class MediaService {
    public static playUnconfirmedTransactionSound(): void {
        new Audio(soundDing).play();
    }

    public static playConfirmedTransactionSound(): void {
        new Audio(soundDing2).play();
    }
}
