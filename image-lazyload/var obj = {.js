/*
 * @Descripttion: 
 * @version: 
 * @Author: Charles Guo
 * @Date: 2020-12-14 00:42:16
 * @LastEditors: Charles Guo
 * @LastEditTime: 2020-12-14 00:42:16
 */
var obj = {
    a: '况喵喵'
};

function bar() {
    this.kmm = 'kmm'
	return this.a;
};

Function.prototype.bind1 = function (context) { 
    // 此时this代表调用者 这里的调用者就是bar， context 代表传入的对象 这里就是obj
    // 调用者一定是函数
    var self = this;
    console.log(this.prototype.constructor, 1);
    console.log(this === bar, 1);
    console.log(typeof this.prototype, 1);
    var fBound = function () {
        // 如果以new方式调用，实例的原型就会指向fBound，
        // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
        // 以上面的是 demo 为例，如果改成 `this instanceof fBound ? null : context`，实例只是一个空对象，将 null 改成 this ，实例会具有 habit 属性
        // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
        // 令返回函数的this绑定实例，否则就绑定传入的对象
        return self.apply(this instanceof fBound ? this : context);
    }
    // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
    fBound.prototype = this.prototype; // 指向构造函数
    return fBound;
}

var bindFoo = bar.bind1(obj); // 因为bind返回的是一个函数，所以需要再次执行下bingFoo，拿到返回的结果
var b = bar.apply(obj) // 而bar则不用，相当于已经执行过了
// bindFoo()
var obj1 = new bindFoo();
console.log(obj1.kmm);