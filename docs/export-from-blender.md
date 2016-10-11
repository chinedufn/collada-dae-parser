## How to Export

### Step 1 - Select your Mesh

Select your mesh in `Object mode` but *DO NOT* select your skeleton (armature).

![image](https://cloud.githubusercontent.com/assets/2099811/19255632/f284ac32-8f2d-11e6-9867-0dea9f61c989.png)

### Step 2 - Export your Mesh

`File -> Export -> Collada`

![image](https://cloud.githubusercontent.com/assets/2099811/19255642/1752cfc6-8f2e-11e6-9f4a-077c50b2985f.png)

### Step 3 - Choose your export settings

lorem ipsum

![image](https://cloud.githubusercontent.com/assets/2099811/19255682/71e9e758-8f2e-11e6-840f-ccc43b95ea2f.png)

## Multiple Meshes

`collada-dae-parser` does not support files with multiple meshes. You should join your geometries in `Object mode` before exporting.

*First select all of your meshes while in Object mode*

![image](https://cloud.githubusercontent.com/assets/2099811/19274522/621af72a-8f9e-11e6-969f-6f51b2f45a4c.png)

*Then join them using `Ctrl` + `J`*

![image](https://cloud.githubusercontent.com/assets/2099811/19274869/b3d4ca04-8f9f-11e6-9148-6cabd81a9ed6.png)

## Skeletons with only Rigid Motions

TODO ... explain this

lorem ipsum...

Make sure to apply scale

lorem ipsum

`CTRL` + `A` while in `Object mode` in Blender. Then `Apply the Scale`

This changes your model to be scaled at `[1.0, 1.0, 1.0]` meaning that your exported joint matrices will be rigid transforms

lorem ipsum

![image](https://cloud.githubusercontent.com/assets/2099811/19255558/34e3cd0c-8f2d-11e6-8169-f93027cefdb2.png)
