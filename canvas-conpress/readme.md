<!--
 * @Descripttion: 
 * @version: 
 * @Author: Charles Guo
 * @Date: 2020-12-08 19:31:24
 * @LastEditors: Charles Guo
 * @LastEditTime: 2020-12-09 15:17:09
-->
# 手撸一个canvas 图片压缩

## 实现思路

说到JS图片压缩，第一想法就是利用Canvas的绘图能力，通过调整图片的分辨率或者绘图质量来达到图片压缩的效果，实现思路如下：

- 获取上传的Input的图片对象File

- 将图片转换成base64格式

- base64编码的图片通过Canvas转换压缩，这里会用到Canvas的drawImage以及toDataURL这两个API，一个调节图片的分辨率的，一个时调节图片压缩质量并输出的，后续会详细介绍

- 转换后的图片生成对应的新图片，然后输出

## 优缺点介绍

- 优点：实现简单，参数可配置化，自定义图片的尺寸，指定区域剪裁等等

- 缺点：只有jpeg和webp支持原图尺寸下图片质量来达到压缩图片的效果，其他图片格式仅能通过调节尺寸来实现

# 总结

本文仅针对图片压缩介绍了一些思路，简单的使用场景可能如下介绍，当然也会引申出来更多的使用场景，这些还有待大家一起挖掘。

- 上传存储图片如果需要对文件大小格式有要求的，可以统一压缩处理图片
- 前台页面想要编辑图片，可以在 Canvas 处理图片的时候，加一些其他逻辑，例如添加文字，剪裁，拼图等等操作

当然温馨提示：因部分接口有 IE 兼容性问题，IE 浏览器方面，仅能支持 IE 10 以上版本进行下载。

代码参考：

[JS 图片压缩](https://www.zoo.team/article/image-compress)