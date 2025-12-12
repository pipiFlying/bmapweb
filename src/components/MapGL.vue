<template>
  <div class="map-container">
    <div id="GL" class="map-container-GL" ref="mapGL"></div>
    <div class="map-container-btns">
      <div class="btn-qy" @click="zoomToHAreas('FQ')">福泉园区</div>
      <div class="btn-item" v-for="(area, index) in FQAreas" :key="index" @click="zoomToArea('FQ', index)">
        {{ area.name }}
      </div>
      <div class="btn-qy" @click="zoomToHAreas('WA')">瓮安园区</div>
      <div v-for="(area, index) in WAAreas" :key="index">
        <div class="btn-item" v-if="area.showTip" @click="zoomToArea('WA', index)">
          {{ area.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FQ } from '@/json/FQ'
import { WA } from '@/json/WA'
import { loadBMapGL } from '@/utils/index'

export default {
  name: 'MapGL',
  data() {
    return {
      mapOptions: {
        center: { lng: 107.46290225830913, lat: 26.808498502453208 },
        zoom: 12,
        tilt: 60,
        minZoom: 10,
        maxZoom: 17,
        styleId: process.env.VUE_APP_MAPSTYLEID,
      },
      areasOptions: {
        FQ: FQ,
        WA: WA,
      },
      FQAreas: [...FQ.areas],
      WAAreas: [...WA.areas],
      areas: [...FQ.areas, ...WA.areas],
      map: null,
      BMapGL: null,
    }
  },
  mounted() {
    loadBMapGL(this.onMapReady)
  },
  methods: {
    onMapReady() {
      window.BMapGL && (this.BMapGL = window.BMapGL)
      this.map = new this.BMapGL.Map(this.$refs.mapGL, {
        enableHighResolution: false,
      })
      const { center, zoom, tilt, styleId, minZoom, maxZoom } = this.mapOptions
      this.map.centerAndZoom(new this.BMapGL.Point(center.lng, center.lat), zoom)
      this.map.setTilt(tilt)
      this.map.setMapStyleV2({ styleId })
      this.map.enableScrollWheelZoom()
      this.map.setMinZoom(minZoom)
      this.map.setMaxZoom(maxZoom)
      this.map.setMapType(window.BMAP_SATELLITE_MAP) // ["BMAP_NORMAL_MAP", "BMAP_SATELLITE_MAP", "BMAP_EARTH_MAP"]
      this.map.enableContinuousZoom()
      this.setAreas()
    },
    setAreas() {
      this.areas.forEach((area) => {
        const points = area.path.map((coord) => new this.BMapGL.Point(coord.lng, coord.lat))
        area.polygon = new this.BMapGL.Polygon(points, {
          strokeColor: area.strokeColor,
          strokeWeight: 3,
          strokeOpacity: 1,
          fillColor: area.fillColor,
          fillOpacity: 0,
          strokeStyle: area.strokeStyle,
        })
        const prism = new this.BMapGL.Prism(points, 100, {
          topFillColor: area.fillColor,
          topFillOpacity: 0.05,
          sideFillColor: area.strokeColor,
          sideFillOpacity: 0.4,
        })
        area.showPrism && this.map.addOverlay(prism)

        const center = this.calculateCenter(points)
        area.showTip && this.creatDOM(center, area)

        this.map.addOverlay(area.polygon)
      })
    },
    calculateCenter(points) {
      const lngs = points.map((p) => p.lng)
      const lats = points.map((p) => p.lat)
      const minLng = Math.min(...lngs)
      const maxLng = Math.max(...lngs)
      const minLat = Math.min(...lats)
      const maxLat = Math.max(...lats)
      return new this.BMapGL.Point((minLng + maxLng) / 2, (minLat + maxLat) / 2)
    },
    zoomToHAreas(h) {
      const { center } = this.areasOptions[h]
      const viewport = { center: new this.BMapGL.Point(center.lng, center.lat), zoom: 12 }
      const options = { duration: 1000, delay: 100, type: window.BMAP_ANIMATION_BOUNCE, tilt: this.mapOptions.tilt }
      this.map.setViewport(viewport, options)
    },
    zoomToArea(ar, index) {
      const area = this[ar + 'Areas'][index]
      const points = area.path.map((coord) => new this.BMapGL.Point(coord.lng, coord.lat))
      const center = this.calculateCenter(points)
      // 设置动画参数
      const viewport = { center: center, zoom: 15 }
      const options = { duration: 1000, delay: 100, type: window.BMAP_ANIMATION_BOUNCE, tilt: 0 }
      this.map.setViewport(viewport, options)
    },
    creatDOM(point, area) {
      function CustomOverlay(point) {
        this._point = point
      }
      CustomOverlay.prototype = new this.BMapGL.Overlay()

      CustomOverlay.prototype.initialize = function (map) {
        this._map = map
        const container = document.createElement('div')
        container.className = 'custom-overlay'
        container.innerHTML = `
          <div class="custom-overlay-box">
            <div class="custom-overlay-title">${area.alias}</div>
          </div>`
        const arrow = document.createElement('div')
        container.appendChild(arrow)
        arrow.className = 'custom-arrow'
        this._div = container
        map.getPanes().labelPane.appendChild(container)
        return container
      }
      CustomOverlay.prototype.draw = function () {
        const pixel = this._map.pointToOverlayPixel(this._point)
        const div = this._div
        const width = div.offsetWidth
        const height = div.offsetHeight
        div.style.left = pixel.x - width / 2 + 'px'
        div.style.top = pixel.y - 2 * height + 'px'
      }
      const customOverlay = new CustomOverlay(point)
      this.map.addOverlay(customOverlay)
    },
  },
  beforeDestroy() {
    this.map && this.map.destroy()
    this.BMapGL && (this.BMapGL = null)
  },
}
</script>

<style lang="scss" scoped>
#GL canvas {
  transform: scale(0.5) translate(-50%, -50%);
  transform-origin: top left;
}
#GL.zooming canvas {
  opacity: 0.8;
  transition: opacity 0.3s ease;
}
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #2e3720;
  &-GL {
    width: 100%;
    height: 100%;
    background: #2e3720;
  }
  &-btns {
    position: absolute;
    z-index: 1000;
    right: W(40);
    bottom: H(50);
    color: $font-text-color-light;
    .btn-qy {
      background: #6de6f8;
      text-align: center;
      margin: H(20) 0;
      padding: H(10);
      border-radius: W(8);
      font-size: W(20);
      &:hover {
        cursor: pointer;
      }
    }
    .btn-item {
      text-align: center;
      margin: H(20) 0;
      padding: H(10);
      min-width: W(100);
      background: url('@/assets/btn-bg.png');
      background-size: 100% 100%;
      font-size: W(16);
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
<style lang="scss">
.custom-overlay {
  position: absolute;
  bottom: 0;
  height: H(80);
  width: W(160);
  font-size: W(16);
  background-color: rgba(0, 60, 120, 0.5);
  box-shadow: 0 0 10px rgba(0, 200, 255, 0.5);
  border-radius: W(8);
  color: $font-text-color-light;
  &-title {
    height: H(80);
    padding: W(5);
    text-align: center;
  }
}
.custom-arrow {
  width: 0;
  height: 0;
  margin: 0 auto;
  margin-top: W(-10);
  border-left: W(16) solid transparent;
  border-right: W(16) solid transparent;
  border-top: W(16) solid rgba(0, 60, 120, 0.6);
}
</style>
