import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component
export class MnemonicInputTs extends Vue {
  /**
   * @description:bind the input
   */
  public inputWord: string = '';

  /**
   * @description: wordsArray
   */
  public wordsArray = [];

  /**
   * @description: status of isEditing 
   */
  public isEditing: boolean = false;

  /**
   * @description: isNeedPressDelTwice
   */
  public isNeedPressDelTwice = true;

  /**
   * @description: watch the inputform
   */
  @Watch('inputWord')
  watchFormItems(newVal:string, oldVal:string) {
    //add the limit
    if (this.wordsArray.length >= 24) {
      this.inputWord = '';
      this.initInput();
    } else {
      //control the keyboard input rules
      this.inputWord = newVal.replace(/[^a-zA-Z]/g, '')
      //determine if the input is editing status
      if (!this.isEditing && !!this.inputWord) {
        this.isEditing = true
      }
    }

  }
  /**
   * @description: add word to the wordsArray
   */
  addWord() {
    if (this.inputWord.length >= 2 && this.inputWord.length <= 50) {
      if (this.wordsArray.length < 24) {
        this.handleWordsArray(this.inputWord);
        this.inputWord = '';
        this.initInput();
      }

    }
  }

  /**
   * @description: delete the word
   */
  deleteWord() {
    if (this.inputWord) {
      this.isNeedPressDelTwice = true;
    } else {
      if (this.isEditing) {
        if (this.isNeedPressDelTwice) {
          this.isNeedPressDelTwice = false;
          return
        }
        this.handleWordsArray();
        this.initInput()
      } else {
        this.handleWordsArray()
        this.initInput()
      }
    }
  }

  /**
   * @description: add one word  or reduce on word
   */
  handleWordsArray(item?) {
    if (!!item) {
      this.wordsArray.push(item)
    } else {
      this.wordsArray.pop()
    }
    //transform to lower case
    this.wordsArray.forEach((item:string,index)=>{
      this.wordsArray[index]=item.toLowerCase();
    })
    this.$emit('handle-words', this.wordsArray)
  }

  /**
   * @description: init input
   */
  initInput() {
    this.isNeedPressDelTwice = true;
    this.isEditing = false
  }

}