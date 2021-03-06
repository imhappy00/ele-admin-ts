/*
 * @Descripttion:订单controller层
 * @version:
 * @Author: 笑佛弥勒
 * @Date: 2019-08-06 16:46:01
 * @LastEditors: 笑佛弥勒
 * @LastEditTime: 2020-03-09 11:04:40
 */

import { BaseController } from "../core/baseController"
import { Status } from "../util/enum"

export default class Order extends BaseController {
    /**
     * @Descripttion: 创建订单
     * @Author: 笑佛弥勒
     * @param {type} 
     * @return: 
     */
    public async createdOrder() {
        let params = this.ctx.request.body
        let orderDetail = params.order_detail
        try {
            this.ctx.validate({ params: 'addOrder' }, { params: params })
        } catch (error) {
            this.fail(Status.InvalidParams, error)
            return
        }
        try {
            Order.createOrderDetail(orderDetail, this.ctx)
        } catch (error) {
            this.fail(Status.SystemError, error)
            return
        }

        try {
            await this.ctx.service.order.createdOrder(params)
            this.success(Status.Success, '订单创建成功')
        } catch (error) {
            this.ctx.logger.error(`-----创建订单错误------`, error)
            this.ctx.logger.error(`入参params：${params}`)
            this.fail(Status.SystemError, "创建订单错误")
        }
    }
    /**
     * @Descripttion: 创建订单详情
     * @Author: 笑佛弥勒
     * @param {orderDetail} 订单详情
     * @param {ctx} 当前请求对象
     * @return: 
     */
    static async createOrderDetail(orderDetail, ctx) {
        for (const item of orderDetail) {
            try {
                ctx.validate({ orderDetail: 'orderDetail' }, { orderDetail: item })
            } catch (error) {
                throw error
            }
            try {
                await ctx.service.orderDetail.createdOrder(item)
            } catch (error) {
                ctx.logger.error(`-----用户注册失败------`, error)
                ctx.logger.error(`入参：orderDetail:${orderDetail}，item: ${item}`)
                throw "详情创建订单错误"
            }
        }
    }

    /**
     * @Descripttion: 订单分页
     * @Author: 笑佛弥勒
     * @param {type} 
     * @return: 
     */
    public async findOrderByPage() {
        let { page, pageSize, shopName } = this.ctx.request.body

        try {
            this.ctx.validate({ page: "number" }, { page: page })
            this.ctx.validate({ pageSize: "number" }, { pageSize: pageSize })
            this.ctx.validate({ shopName: "string" }, { shopName: shopName })
        } catch (error) {
            this.fail(Status.InvalidParams, "参数错误")
            return
        }

        try {
            this.ctx.body = await this.ctx.service.order.findOrderByPage(page, pageSize, shopName)
        } catch (error) {
            this.fail(Status.SystemError, "查询失败")
        }
    }
}
