<template>
  <div class="randomlist-list" v-if="isshow">
    <div v-for="(item, index) in listData" class="randomlist-item">
      <img class="randomlist-pic" v-bind:class="{ big: scaleImgId.indexOf(index) !== -1 }" v-lazy="item.url" @click="handleImgDblclick(index)" v-if="item.type == 'pic'"/>
      <img class="randomlist-pic" v-lazy="item.comicImgList[0]" @click="handleComicClick(index)" v-if="item.type == 'comic'"/>
      <!--<div v-if="isVideo(item.url)">-->
      <lazy-component>
        <video :ref="'video'+index" class="randomlist-pic" :src="item.url" preload="metadata" controls="true" v-if="item.type == 'video'"></video>
        <video :ref="'video'+index" class="randomlist-pic short-video" autoplay="autoplay" loop="loop" :src="item.url" preload="metadata" v-if="item.type == 'shortvideo'" playsinline></video>
      </lazy-component>
        <!--<div class="randomlist-itemname">-->
          <!--<van-icon name="play"></van-icon>-->
          <!--{{ item.name }}-->
        <!--</div>-->
      <!--</div>-->
      <div class="randomlist-comicicon" v-if="item.type == 'comic'">
        <div class="wordart superhero"><span class="text">Comic</span></div>
      </div>
      <div class="randomlist-deleteicon" @click="handleDelectClick(index)"></div>
      <div class="randomlist-likeicon" @click="handleLikeClick(index)"></div>
    </div>
    <div class="randomlist-next" v-on:click="getRandomList">
      NEXT
    </div>
    <ComicReader :crshow="ComicReaderShow" @crback="handleCrback" :urls="ComicUrls"></ComicReader>
    <!--<van-popup v-model="isshow">内容</van-popup>-->
  </div>
</template>

<script>
  import ComicReader from './ComicReader'
  import enableInlineVideo from 'iphone-inline-video'

  export default {
    name: 'randomList',
    components: {
      ComicReader
    },
    data() {
      return {
        scaleImgId: [],
        listData: null,
        mode: 'random',
        isshow: true,
        dblclickCount: 0,
        ComicUrls: [],
        ComicReaderShow: false
      }
    },
    mounted() {
      this.getRandomList()
    },
    computed: {
    },
    methods: {
      getRandomList() {
        const self = this
        this.isshow = false
        this.scaleImgId = []
        // gtslisttest getgtsrandomlist
        this.$axios.get('http://45.32.13.18:3000/api/getgtsrandomlist', {
        }).then(function(response) {
          const resData = response.data
          self.listData = []
          for (const listDataItem of resData) {
            switch (listDataItem.type) {
              case 'comic':
                const comicImgList = JSON.parse(listDataItem.url)
                const comicImgObj = {
                  ...listDataItem,
                  comicImgList
                }
                self.listData.push(comicImgObj)
                break
              default:
                self.listData.push(listDataItem)
            }
          }
          self.isshow = true
        }).catch(function(error) {
          console.log(error)
        })
        // window.scrollTo(0, 0);
      },
      setInlineVideo() {
        const allVideo = document.querySelectorAll('.short-video')
        allVideo.each(function() {
          enableInlineVideo(this);
        });
      },
      getComicCover(url) {
        return (JSON.parse(url)[0])
      },
      handleImgDblclick(index) {
        // console.log('dbl')
        this.dblclickCount += 1
        if (this.dblclickCount > 1) {
          const imgIndex = this.scaleImgId.indexOf(index)
          if (imgIndex === -1) {
            this.scaleImgId.push(index)
          } else {
            this.scaleImgId.splice(imgIndex, 1)
          }
        }
        setTimeout(() => {
          this.dblclickCount -= 1
        }, 500)
      },
      handleDelectClick(index) {
        this.$dialog.confirm({
          title: '提示',
          message: '是否删除该元素'
        }).then(() => {
          // console.log('delete')
          this.$axios.post('http://45.32.13.18:3000/api/deletepicfromid', {
            id: this.listData[index].id
          }).then(() => {
            this.listData.splice(index, 1);
          })
        }).catch(() => {
          ;
        })
      },
      handleLikeClick(index) {
        this.$axios.post('http://45.32.13.18:3000/api/likepicfromid', {
          name: this.listData[index].name,
          url: this.listData[index].url,
          author: this.listData[index].author,
          alubmid: this.listData[index].alubmid,
          type: this.listData[index].type
        }).then(() => {
          alert('添加成功')
        })
      },
      handleComicClick(index) {
        this.ComicReaderShow = true
        document.body.style.overflow = 'hidden'
        this.ComicUrls = this.listData[index].comicImgList
      },
      handleCrback() {
        this.ComicReaderShow = false
        document.body.style.overflow = 'visible'
        this.ComicUrls = []
      },
      // handleVideoClick(index) {
      //   this.$refs['video' + index][0].controls = true
      //   console.log(this.$refs['video' + index])
      // },
      isImg(url) {
        const urlsp = url.split('.')
        return (urlsp[urlsp.length - 1] === 'jpg' || urlsp[urlsp.length - 1] === 'png')
      },
      isVideo(url) {
        const urlsp = url.split('.')
        // if (urlsp[urlsp.length - 1] === 'mp4') console.log('mp4');
        return urlsp[urlsp.length - 1] === 'mp4'
      }
    }
  };
</script>

<style scoped>
  .randomlist-pic{
    width: 100%;
    display: block;
    /*margin: 5px;*/
    /*margin-bottom: 20px;*/
    /*box-shadow: 0 0px 20px rgba(0, 0, 0, 0.4);*/
  }
  .randomlist-next{
    width: 100%;
    height: 200px;
    text-align: center;
    margin-top: 50px;
    font-size: 2rem;
  }
  .randomlist-list{
    background: #F2EFE6;
  }
  .big{
    -webkit-transform-origin: 0 0 0;
    /*transform-origin: 100% 100% 0;*/
    /*transform: scale(2);*/
    width: 200%;
  }
  .randomlist-item{
    width: 100%;
    overflow: scroll;
    margin-bottom: 20px;
    box-shadow: 0 0px 20px rgba(0, 0, 0, 0.4);
    position: relative;
  }
  .randomlist-itemname{
    position: relative;
    line-height: 30px;
    height: 0px;
    /*padding: 0px 0px;*/
    padding-bottom: 30px;
    background: white;
    opacity: 0.5;
    font-size: large;
    bottom: 30px;
  }
  .randomlist-deleteicon{
    position: absolute;
    right: 0px;
    top: 0px;
    height: 40px;
    width: 40px;
    z-index: 1000;
  }
  .randomlist-likeicon{
    position: absolute;
    left: 0px;
    top: 0px;
    height: 40px;
    width: 40px;
    z-index: 1000;
  }
  .randomlist-comicicon{
    position: absolute;
    left: 0px;
    bottom: 100px;
    /*height: 40px;*/
    /*width: 40px;*/
    background: rgba(0, 0, 0, 0.2)
    /*z-index: 1;*/
  }

  .wordart {
    font-family: Arial, sans-serif;
    font-size: 3em;
    font-weight: bold;
    position: relative;
    /*z-index: 1;*/
    display: inline-block;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .wordart.superhero {
  }

  .wordart.superhero .text {
    font-family: Impact;
    background: #fdea00;
    background: -moz-linear-gradient(top, #fdea00 0%, #fdcf00 44%, #fc2700 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #fdea00), color-stop(44%, #fdcf00), color-stop(100%, #fc2700));
    background: -webkit-linear-gradient(top, #fdea00 0%, #fdcf00 44%, #fc2700 100%);
    background: -o-linear-gradient(top, #fdea00 0%, #fdcf00 44%, #fc2700 100%);
    background: -ms-linear-gradient(top, #fdea00 0%, #fdcf00 44%, #fc2700 100%);
    background: linear-gradient(to bottom, #fdea00 0%, #fdcf00 44%, #fc2700 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fdea00', endColorstr='#fc2700', GradientType=0);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .wordart.superhero .text:before {
    content: attr(data-text);
    position: absolute;
    z-index: -1;
    text-shadow: 0.01em 0em 0 #802700, 0em 0.01em 0 #c23d00, 0.02em 0.01em 0 #802700, 0.01em 0.02em 0 #c23d00, 0.03em 0.02em 0 #802700, 0.02em 0.03em 0 #c23d00, 0.04em 0.03em 0 #802700, 0.03em 0.04em 0 #c23d00, 0.05em 0.04em 0 #802700, 0.04em 0.05em 0 #c23d00, 0.06em 0.05em 0 #802700, 0.05em 0.06em 0 #c23d00, 0.07em 0.06em 0 #802700, 0.06em 0.07em 0 #c23d00, 0.08em 0.07em 0 #802700, 0.07em 0.08em 0 #c23d00;
  }

  .IIV::-webkit-media-controls-play-button,
  .IIV::-webkit-media-controls-start-playback-button {
      opacity: 0;
      pointer-events: none;
      width: 5px;
  }
</style>
