<template>
    <!-- banner -->
    <view class="banner">
        <image class="cover" :src="goods_image" mode="aspectFit"></image>
    </view>

    <view class="main">
        <!-- 标题 -->
        <view class="title">{{ goods_name }}</view>

        <!-- 描述 -->
        <view class="describe">{{ goods_describe }}</view>

        <!-- 规格 -->
        <view class="specification">
            <view class="box" v-for="(item) in goods_stats" :key="item.name">
                <view class="title">{{ item.name }}</view>
                <view class="attr_list">
                    <view class="select_attr" v-for="(item_a) in item.subAttributes" :key="item_a._id">
                        {{ item_a.name }}
                    </view>
                </view>
            </view>
        </view>
    </view>

    <view class="shopping_cart">
        <view class="dispose">
            <view class="price">￥{{ goods_price }}</view>
            <view class="select_number">
                <image class="cover" src="/static/jian-goods.png"></image>
                <text class="num">{{ quantity }}</text>
                <image class="cover" src="/static/jia-goods.png"></image>
            </view>
        </view>
        <view class="attr">
            <text class="text">中杯</text>
            <text class="text">全糖</text>
            <text class="text">正常冰</text>
        </view>
        <view class="join_cart">
            加入购物车
        </view>
    </view>

    <!-- 占位 -->
    <view style="height: 200px;"></view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from "@dcloudio/uni-app";

const goods_image = ref('');
const goods_name = ref('');
const goods_describe = ref('');
const goods_price = ref('');
const quantity = ref(0);  // 购买数量
const category_id = ref('');
const goods_stats = ref([]); // 规格列表
const goods_stock = ref(0); // 库存


onLoad((event) => {
    const data = JSON.parse(event.item);
    console.log('data', data);
    goods_image.value = data.goods_image;
    goods_name.value = data.goods_name;
    goods_describe.value = data.goods_describe;
    goods_price.value = data.goods_price;
    goods_stats.value = data.goods_stats;
    goods_stock.value = data.goods_stock;
    category_id.value = data.category_id;
    quantity.value = data.quantity;

})
</script>

<style lang="scss" scoped>
.banner {

    .cover {
        margin: auto;
    }
}

.main {
    padding: 20rpx;

    .title {
        font-size: 34rpx;
        font-weight: 600;
    }

    .describe {
        font-size: 28rpx;
        line-height: 38rpx;
        color: #ccc;
        margin: 20rpx 0;
    }

    .specification {
        padding-top: 20rpx;

        .box {
            margin-bottom: 20rpx;

            .title {
                font-size: 28rpx;
                font-weight: 600;
                margin-bottom: 14rpx;
            }

            .attr_list {
                display: flex;
                flex-wrap: wrap;

                .select_attr {
                    font-size: 22rpx;
                    border: 1px solid #f5f5f5;
                    margin: 0 20rpx 20rpx 0;
                    padding: 10rpx 20rpx;
                }
            }
        }
    }
}

.shopping_cart {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    border-top: 1px solid rgba(0, 0, 0, .1);
    padding: 40rpx 30rpx 80rpx;
    background: #fff;

    .dispose {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .price {
            flex: 1;
            font-size: 34rpx;
            font-weight: 600;
        }

        .select_number {
            display: flex;
            align-items: center;

        }

        .num {
            padding: 0 20rpx;
        }

        .cover {
            width: 46rpx;
            height: 46rpx;
        }
    }

    .attr {
        padding: 20rpx 0;
        display: flex;
        align-items: center;

        .text {
            font-size: 24rpx;
            color: #999;
            padding-right: 12rpx;
            position: relative;

            &::before {
                content: '/';
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
            }
        }

        .text:last-child {
            &::before {
                display: none;
            }
        }
    }

    .join_cart {
        text-align: center;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 28rpx;
        font-weight: 600;
        border-radius: 12rpx;
        background: #ccc;
    }
}
</style>