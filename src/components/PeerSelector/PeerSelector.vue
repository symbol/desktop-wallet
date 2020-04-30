<template>
  <div :class="[isConnected ? 'endpoint-healthy' : 'endpoint-unhealthy']">
    <Poptip placement="bottom-end" class="endpoint-poptip" @on-popper-show="onPopTipShow">
      <div class="peer-selector-trigger cursor-pointer">
        <i class="icon-status" />
        <span v-if="isConnected" class="network-type-text">{{ networkTypeText }}</span>
      </div>
      <div slot="title" class="peer-selector-title text-center">
        {{ $t('current_endpoint') }}：{{ currentPeerInfo.url }} - {{ currentPeerInfo.friendlyName }}
      </div>
      <div slot="content">
        <div class="inputs-container select-container">
          <form class="input-point point-item">
            <input
              v-model="formItems.filter"
              :data-vv-as="$t('filter')"
              data-vv-name="filter"
              :placeholder="$t('filter_peers')"
            />
          </form>
        </div>

        <div class="node-list">
          <div id="node-list-container" v-auto-scroll="'peer-selected'" class="node-list-container scroll">
            <div
              v-for="({ url, friendlyName }, index) in peersList"
              :key="`sep${index}`"
              :class="['point-item', 'cursor-pointer', { 'peer-selected': currentPeerInfo.url === url }]"
              @click="currentPeerInfo.url !== url ? switchPeer(url) : ''"
            >
              <img
                class="icon-check"
                :src="currentPeerInfo.url === url ? imageResources.selected : imageResources.unselected"
              />
              <span class="node-url">{{ url }} - {{ friendlyName }}</span>
              <img
                v-if="currentPeerInfo.url !== url"
                class="icon-remove"
                src="@/views/resources/img/service/multisig/multisigDelete.png"
                @click.stop="removePeer(url)"
              />
            </div>
          </div>
          <ValidationObserver ref="observer" v-slot="{ handleSubmit }" slim>
            <form
              action="submit"
              onsubmit="event.preventDefault()"
              class="node-inputs-container"
              @keyup.enter="handleSubmit(addPeer)"
            >
              <ValidationProvider
                v-slot="{ errors }"
                mode="lazy"
                vid="endpoint"
                :name="$t('endpoint')"
                :rules="validationRules.url"
                tag="div"
                class="inputs-container select-container"
              >
                <ErrorTooltip :errors="errors">
                  <input
                    v-model="formItems.nodeUrl"
                    :data-vv-as="$t('endpoint')"
                    data-vv-name="endpoint"
                    :placeholder="$t('please_enter_a_custom_nod_address')"
                    style="height: 100%;"
                  />
                </ErrorTooltip>
              </ValidationProvider>
              <span class="button button-add cursor-pointer" @click="handleSubmit(addPeer)">+</span>
              <span class="button button-reset cursor-pointer" @click.stop="resetList()">
                <Icon type="md-refresh" />
              </span>
            </form>
          </ValidationObserver>
        </div>
      </div>
    </Poptip>
  </div>
</template>

<script lang="ts">
import { PeerSelectorTs } from './PeerSelectorTs'

export default class PeerSelector extends PeerSelectorTs {}
</script>

<style lang="less" scoped>
@import './PeerSelector.less';
</style>
