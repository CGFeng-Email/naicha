<template>
    <view class="order_details">
        <view class="code">取餐码 {{ code }}</view>
        <view class="shop">
            <view class="head">
                <view class="title">{{ shop_name }}+</view>
                <view class="share">
                    <image class="cover" src="/static/daohang.png"></image>
                </view>
            </view>

            <view class="list">
                <view class="item" v-for="(item) in orderList" :key="item.category_id">
                    <image class="cover" :src="item.goods_image"></image>
                    <view class="content">
                        <view class="left">
                            <view class="title">{{ item.goods_name }}</view>
                            <view class="num">x{{ item.quantity }}</view>
                        </view>
                        <view class="price">￥{{ item.goods_price }}</view>
                    </view>
                </view>
                <view class="total_price">合计：￥{{ total_price }}</view>
            </view>
        </view>

        <div class="describe_list">
            <view class="li">
                <view class="name">订单类型：</view>
                <view class="value">{{ order_type }}</view>
            </view>
            <view class="li">
                <view class="name">取餐码：</view>
                <view class="value">{{ code }}</view>
            </view>
            <view class="li">
                <view class="name">下单时间：</view>
                <view class="value">{{ order_date }}</view>
            </view>
            <view class="li">
                <view class="name">订单号：</view>
                <view class="value">{{ order_number }}</view>
            </view>
        </div>
    </view>
</template>

<script setup>
import { ref } from 'vue';
import require from '@/api/require';
import { orderDetailsAPI } from '@/api/api';

const code = ref('');
const shop_name = ref('');
const order_type = ref('');
const order_date = ref('');
const order_number = ref('');
const total_price = ref('');
const orderList = ref([]);

const getOrderDetails = async () => {
    const res = await require(orderDetailsAPI);
    console.log('订单详情', res);
    shop_name.value = res.shop_name;
    code.value = res.code;
    order_type.value = res.order_type;
    order_date.value = res.order_time;
    order_number.value = res.order_number;
    total_price.value = res.total_price;
    orderList.value = res.data;
}

getOrderDetails()


</script>

<style lang="scss" scoped>
.order_details {
    min-height: 100vh;
    padding: 20rpx;
    background: #f6f6f6;

    .code {
        background: #fff;
        border-radius: 12rpx;
        height: 140rpx;
        line-height: 140rpx;
        text-align: center;
        font-size: 32rpx;
        font-weight: 600;
        margin-bottom: 20rpx;
    }

    .shop {
        background: #fff;
        border-radius: 12rpx;
        margin-bottom: 20rpx;
        padding: 0 20rpx;

        .head {
            padding: 20rpx 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);

            .title {
                font-size: 28rpx;
                font-weight: 600;
            }

            .cover {
                width: 34rpx;
                height: 34rpx;
            }
        }

        .list {
            .item {
                padding: 20rpx 0;
                display: flex;
                justify-content: space-between;

                .cover {
                    width: 170rpx;
                    height: 170rpx;
                    object-fit: cover;
                }

                .content {
                    flex: 1;
                    padding-left: 20rpx;
                    height: 170rpx;
                    display: flex;
                    justify-content: space-between;

                    .left {
                        flex: 1;

                        .title {
                            font-size: 28rpx;
                            font-weight: 600;
                        }

                        .num {
                            font-size: 24rpx;
                            margin: 10rpx 0;
                            color: #999;
                        }
                    }

                    .price {
                        flex: none;
                        font-size: 28rpx;
                        font-weight: 600;
                    }
                }
            }

            .total_price {
                border-top: 1px solid rgba(0, 0, 0, 0.1);
                font-size: 32rpx;
                text-align: right;
                font-weight: 600;
                padding: 20rpx 0;
            }
        }
    }

    .describe_list {
        background: #fff;
        border-radius: 12rpx;
        padding: 0 20rpx;

        .li {
            padding: 30rpx 20rpx;
            display: flex;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);

            .name {
                font-size: 26rpx;
            }

            .value {
                font-size: 24rpx;
                line-height: 34rpx;
                flex: 1;
                text-align: right;
            }
        }

        .li:last-child {
            border-bottom: 0;
        }
    }
}
</style>