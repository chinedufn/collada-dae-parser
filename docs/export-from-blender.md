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

![image](https://cloud.githubusercontent.com/assets/2099811/19275194/ee841a00-8fa0-11e6-89a3-5f5edf67763b.png)

*Then join them using `Ctrl` + `J`*

![image](https://cloud.githubusercontent.com/assets/2099811/19274869/b3d4ca04-8f9f-11e6-9148-6cabd81a9ed6.png)

## Control Joints

`collada-dae-parser` does not support control bones such as pole targets, inverse kinematic bones or control bones.

If you're rig uses control bones, you'll need to apply their effects onto your deformation joints before exporting your mesh.

#### 1. Start from a copy file

Begin by saving and working from a new copy of your model, since you'll be modifying your keyframes and rig before exporting.

![armature with control joints](blender-export/screenshots/armature-with-control-bones.png)

#### 2. Visual keyframes

Go through all of your animation's keyframes, select all bones and insert a visual location rotation keyframe.

This adds a keyframe to each joint that positions it exactly how you see it. Effectively baking the effects of
your control bones into your deformation bones.

![insert visual keyframes](blender-export/screenshots/insert-visual-key.png)

#### 3. Delete control bones

Once you've added your visual keyframes you can delete all of your control bones and verify that your
animation still works. If so, you can export your collada file as usual.

![delete control bones](blender-export/screenshots/delete-control-bones.png)

## Skeletons with only Rigid Motions

TODO ... explain this

lorem ipsum...

Make sure to apply scale

lorem ipsum

`CTRL` + `A` while in `Object mode` in Blender. Then `Apply the Scale`

This changes your model to be scaled at `[1.0, 1.0, 1.0]` meaning that your exported joint matrices will be rigid transforms

lorem ipsum

![image](https://cloud.githubusercontent.com/assets/2099811/19255558/34e3cd0c-8f2d-11e6-8169-f93027cefdb2.png)
