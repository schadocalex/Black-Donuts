import {
  DisplayObject,
  FloatScatter,
  Emitter,
  AssetManager,
  InitialLife,
  ScaleOverLife,
  Input,
  BlendMode,
  AlphaOverLife,
  Acceleration,
  MathEx
} from 'black-engine';

export default class FXTrail extends DisplayObject {
  constructor() {
    super();
    this.isDirty = false;
  }

  onAdded() {
    this.type = 1;
    this.emitter = this.addChild(new Emitter());
    this.emitter.blendMode = BlendMode.ADD;

    // Zero all default values since we dont need any particles at the start
    this.emitter.emitCount = new FloatScatter(5);
    this.emitter.emitDelay = new FloatScatter(0);
    this.emitter.emitInterval = new FloatScatter(0);
    this.emitter.emitDuration = new FloatScatter(Infinity);
    this.emitter.emitNumRepeats = new FloatScatter(Infinity);

    // Pick a texture for emitting
    this.emitter.textures = AssetManager.default.getTextures('particle_ex*');

    this.emitter.x = 960 / 2;
    this.emitter.y = 640 / 2;

    this.emitter.space = this;

    // No one lives forever
    this.emitter.add(new InitialLife(0.5));

    this.emitter.add(new ScaleOverLife(0.3, 0.6));
    this.emitter.add(new Acceleration(-600, -600, 600, 600));
    this.emitter.add(new AlphaOverLife(1, 0));
  }

  onUpdate() {
    if (!this.emitter)
      return;

    if (Input.isPointerDown) {
      let point = this.globalToLocal(Input.pointerPosition);
      let t = this.isDirty ? 1 : 0.2;

      this.emitter.x = MathEx.lerp(this.emitter.x, point.x, t);
      this.emitter.y = MathEx.lerp(this.emitter.y, point.y, t);
      this.isDirty = false;
    }
    else {
      this.isDirty = true;
      this.emitter.x = 2000;
    }
  }
}