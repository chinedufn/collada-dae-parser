## Support for Dual Quaternion Linear Blending

`collada-dae-parser` exports the joints from your animation keyframes as matrices, but a consumer can convert these into dual quaternions without much work.

*TODO: Create separate convenience module to convert keyframes into dual quaternions for you*

```js
var someModel = fs.readFileSync('./some-model.dae')
var jointMatrixKeyframes = dae2JSON(someModel).keyframes

// Convert our joint keyframes into dual quaternion keyframes
var dualQuatKeyframes = Object.keys(myJointMatrixKeyframes).reduce(function (dualQuatKeyframes, keyframeTime) {
    dualQuatKeyframes[keyframeTime] = myJointMatrixKeyframes[keyframeTime].reduce(function (jointQuats, jointMatrix) {
      // TODO: Copy dual quat conversion formula from demo
      // jointDualQuat = ...
      return jointQuats.concat(jointDualQuat)
    }, [])
  return dualQuatKeyframes
}, {})
```

## Further Dual Quaternion Reading

[Skinning with Dual Quaternions](https://www.cs.utah.edu/~ladislav/kavan07skinning/kavan07skinning.pdf)

[A Beginner's Guide to Dual Quaternions](http://cs.gmu.edu/~jmlien/teaching/cs451/uploads/Main/dual-quaternion.pdf)

[Applications of Dual Quaternions in Three
Dimensional Transformation and Interpolation](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.434.4796&rep=rep1&type=pdf)
