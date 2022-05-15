<template>
    <div ref="cr" v-bind:style="{display: displayShow}" v-if="urls.length">
      <div ref="crmask" class="cr-mask" v-on:click="handleSwiperClick">
          <swiper :options="swiperOption" ref="mySwiper" v-on:slideChangeTransitionEnd="handleSwiperChanged" v-if="swiperSlides.length > 0">
            <swiper-slide v-for="item in virtualData.slides" :style="{left: `${virtualData.offset}px`}" v-bind:key="item.id">
              <div class="swiper-zoom-container">
                <img :src="item" style="width: 100%"/>
              </div>
            </swiper-slide>
          </swiper>
      </div>
      <div class="cr-slider">
        <vue-slider ref="slider" v-model="sliderValue" :min="1" :max="sliderMax" @callback="handleSliderchanged"
                    :show="sliderShow" :lazy="true">
        </vue-slider>
      </div>
      <div class="cr-back">
        <van-icon name="arrow-left" color="white" v-on:click="handleBackClick"/>
      </div>
      <div class="cr-back-bottom" v-if="sliderShow" v-on:click="handleBackClick">
        <font size="20"><<返回</font>
      </div>
    </div>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import vueSlider from 'vue-slider-component'
  import 'swiper/dist/css/swiper.css'

  export default {
    name: 'ComicReader',
    components: {
      swiper,
      swiperSlide,
      vueSlider
    },
    props: ['urls', 'crshow'],
    computed: {
      displayShow() {
        return this.crshow ? 'inline' : 'none'
      }
    },
    watch: {
      urls(val) {
        this.sliderMax = val.length
        this.swiperSlides = val
      }
    },
    data() {
      return {
        sliderShow: false,
        sliderValue: 1,
        sliderMax: 1,
        sliderIndex: -1,
        swiper: null,
        swiperSlides: [],
        virtualData: {
          slides: []
        },
        swiperStatus: 'init',
        swiperOption: {
          zoom: {
            maxRatio: 2
          },
          virtual: {
            addSlidesBefore: 1,
            addSlidesAfter: 1,
            renderExternal: (data) => {
              console.log('renderExternal', data)
              this.virtualData = data
            }
          }
        }
      }
    },
    mounted() {
    },
    updated() {
      if (this.$refs.mySwiper) {
        this.swiper = this.$refs.mySwiper.swiper
        this.swiper.virtual.slides = this.urls
        this.swiper.update()
      }
    },
    methods: {
      virtualRenderExternal(data) {
        this.virtualData = data
      },
      onChange() {
      },
      handleSliderchanged() {
        this.swiper.slideTo(this.sliderValue - 1, 0, false)
      },
      handleSwiperChanged() {
        this.sliderValue = this.swiper.activeIndex + 1
      },
      handleSwiperClick() {
        this.sliderShow = !this.sliderShow
      },
      handleBackClick() {
        this.swiperSlides = []
        this.sliderValue = 1
        this.sliderMax = 1
        this.swiperStatus = 'destroyed'
        this.$emit('crback')
        this.sliderShow = false
      }
    }
  };
</script>

<style scoped>
.swiper-container{
  width: 100%;
  height: 100%;
}
.cr-mask{
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background: black;
  /*z-index: 100;*/
}
.swiper-slide{
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
}
.cr-slider{
  position: fixed;
  bottom: 100px;
  left: 20px;
  right: 20px;
}
.cr-back{
  position: fixed;
  top: 20px;
  left: 15px;
  width: 50px;
  height: 50px;
  /*background: white;*/
}
.cr-back-bottom{
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 150px;
  height: 70px;
  opacity: 0.5;
  background: white;
}
</style>
