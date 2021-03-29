//@ts-ignore
import soundDing from '@/views/resources/audio/ding.ogg';
//@ts-ignore
import soundDing2 from '@/views/resources/audio/ding2.ogg';

export class MediaService {
    public static playUnconfirmedTransactionSound(): void {
        new Audio(soundDing).play();
    }

    public static playConfirmedTransactionSound(): void {
        new Audio(soundDing2).play();
    }
}
