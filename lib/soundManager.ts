import {Howl} from 'howler'

export const sounds = {
  correct: new Howl({ src: ['/sounds/correct.mp3'] }),
  wrong: new Howl({ src: ['/sounds/wrong.mp3'] }),
  levelUp: new Howl({ src: ['/sounds/level-up.mp3'] }),
  click: new Howl({ src: ['/sounds/click.mp3'] }),
  open: new Howl({ src: ['/sounds/open.mp3'] }),
};
