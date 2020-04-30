<template>
  <div class="mosaics-list-container">
    <div v-if="!isEditionMode" class="mosaic-list-displayed fade-in-animation">
      <div class="mosaic-list-displayed-header">
        <div class="header-text">
          {{ $t('assets') }}
        </div>
        <img
          slot="extra"
          class="cursor-pointer"
          src="@/views/resources/img/monitor/monitorAssetList.png"
          @click="isEditionMode = true"
        />
      </div>
      <ul class="mosaic-list-displayed-body">
        <li v-for="(entry, index) in filteredBalanceEntries" :key="index" class="mosaic-list-item">
          <Row type="flex" align="middle">
            <i-col span="15" class-name="flex-align-center">
              <img
                v-if="entry.id.equals(networkMosaic)"
                class="icon-mosaic"
                src="@/views/resources/img/symbol/XYMCoin.png"
                alt
              />
              <img v-else src="@/views/resources/img/symbol/XYMCoin.png" class="icon-mosaic grayed-xym-logo" />
              <span class="item-mosaic-name">{{ entry.name !== '' ? entry.name : entry.id.toHex() }}</span>
            </i-col>
            <i-col span="9" class="text-right">
              <span class="item-mosaic-value">
                <MosaicAmountDisplay :id="entry.id" :absolute-amount="entry.amount" :size="'normal'" />
              </span>
            </i-col>
          </Row>
        </li>
      </ul>
    </div>
    <div v-else class="mosaic-list-edit fade-in-animation">
      <div class="mosaic-list-edit-header flex-align-center">
        <img
          src="@/views/resources/img/monitor/monitorLeftArrow.png"
          class="icon-back cursor-pointer"
          alt
          @click="isEditionMode = false"
        />
        <div class="toggle-check-all cursor-pointer">
          <span class="flex-align-center" @click="toggleMosaicDisplay()">
            {{ areAllMosaicsShown() ? $t('uncheck_all') : $t('select_all') }}
            <img
              class="icon-check"
              :src="areAllMosaicsShown() ? dashboardImages.selected : dashboardImages.unselected"
            />
          </span>
        </div>
      </div>
      <ul class="mosaic-list-edit-body">
        <li
          v-for="(entry, index) in allBalanceEntries"
          :key="index"
          class="mosaic-list-item cursor-pointer"
          @click="toggleMosaicDisplay(entry.id)"
        >
          <Row type="flex" align="middle">
            <i-col span="3" class-name="flex-align-center cursor-pointer">
              <img
                class="icon-check"
                :src="isMosaicHidden(entry.id) ? dashboardImages.unselected : dashboardImages.selected"
              />
            </i-col>
            <i-col span="12" class-name="flex-align-center">
              <img
                v-if="entry.id.equals(networkMosaic)"
                src="@/views/resources/img/symbol/XYMCoin.png"
                class="icon-mosaic"
              />
              <img v-else src="@/views/resources/img/symbol/XYMCoin.png" class="icon-mosaic grayed-xym-logo" />
              <span class="item-mosaic-name">
                {{ entry.name }}
              </span>
            </i-col>
            <i-col span="9" class-name="text-right">
              <span class="item-mosaic-value">
                <MosaicAmountDisplay :id="entry.id" :absolute-amount="entry.amount" :size="'normal'" />
              </span>
            </i-col>
          </Row>
        </li>
      </ul>
      <div class="mosaic-list-edit-footer">
        <Button type="info" ghost class="cursor-pointer" @click="isEditionMode = false">
          {{ $t('close') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MosaicBalanceListTs } from './MosaicBalanceListTs'
export default class MosaicBalanceList extends MosaicBalanceListTs {}
</script>
<style lang="less" scoped>
@import './MosaicBalanceList.less';
</style>
