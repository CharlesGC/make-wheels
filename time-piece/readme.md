<!--
 * @Descripttion: 
 * @version: 
 * @Author: Charles Guo
 * @Date: 2020-12-13 12:20:22
 * @LastEditors: Charles Guo
 * @LastEditTime: 2020-12-13 12:21:25
-->
# 利用时间分片渲染大量数据

众所周知，页面的卡顿是由于同时渲染大量 DOM 所引起的，所以我们考虑将渲染过程分批进行。常见的分批渲染使用setTimeout,requestAnimationFrame和DocumentFragment。