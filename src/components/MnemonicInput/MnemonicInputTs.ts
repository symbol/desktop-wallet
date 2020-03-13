import {Component, Prop, Vue,Watch} from 'vue-property-decorator';
@Component
export class MnemonicInputTs extends Vue{
    public inputWord:string='';
    public wordsArray = [];
    public isEditing: boolean = false;
    public isNeedPressDelTwice = true;
    @Watch('inputWord')
    watchFormItems(newVal, oldVal) {
      this.inputWord = newVal.replace(/[^a-zA-Z]/g, '')
      if (!this.isEditing && !!this.inputWord) {
        this.isEditing = true
      }
    }
    addWord() {
      if (this.inputWord.length>=2&&this.inputWord.length<=50) {
        this.handleWordsArray(this.inputWord);
        this.inputWord = '';
        this.initInput();
      }
    }
    deleteWord() {
      if (this.inputWord) {
        this.isNeedPressDelTwice=true;
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
    handleWordsArray(item?){
      if(!!item){
        this.wordsArray.push(item)
      }else{
        this.wordsArray.pop()
      }
      this.$emit('handle-words',this.wordsArray)
    }
    initInput(){
      this.isNeedPressDelTwice=true;
      this.isEditing=false
    }
    
}