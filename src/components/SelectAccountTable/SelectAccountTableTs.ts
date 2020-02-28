/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component, Prop, Vue } from 'vue-property-decorator'


@Component
export class SelectAccountTableTs extends Vue {

  @Prop({
    default: () => [],
  }) walletList: {address: string, path: string,assets: string,choices: boolean, index: number}[]

  
  columns1 = [
    {
      title: 'ADDRESS',
      key: 'address',
      width: 450,
    },
    {
      title: 'PATH',
      key: 'path',
      width: 190,
    },
    {
      title: 'ASSETS',
      key: 'assets',
      width: 190,
    },
    {
      title: 'CHOICES',
      slot: 'choices',
      align: 'center',
      // width: 80,
    },
  ]

  selectedList: number[] = []

  toggleSelect(row, index) {
    this.walletList[index].choices = !this.walletList[index].choices
    if (this.selectedList.includes(index)) {
      this.selectedList.splice(this.selectedList.indexOf(index), 1)
    } else {
      this.selectedList.push(index)
    }
    this.$emit('click-row', this.selectedList)
  }

}
