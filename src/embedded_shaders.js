export const ScanBlockSize = 512;
export const SortChunkSize = 256;
export const prefix_sum_comp_spv = `alias RTArr = array<u32>;

alias RTArr_1 = array<u32>;

struct Data {
  vals : RTArr_1,
}

struct BlockSums {
  block_sums : RTArr_1,
}

var<workgroup> chunk : array<u32, 512u>;

var<private> gl_LocalInvocationID : vec3<u32>;

@group(0) @binding(0) var<storage, read_write> x_23 : Data;

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(1) var<storage, read_write> x_105 : BlockSums;

var<private> gl_WorkGroupID : vec3<u32>;

fn main_1() {
  var offs : u32;
  var d : i32;
  var a : u32;
  var b : u32;
  var d_1 : i32;
  var a_1 : u32;
  var b_1 : u32;
  var tmp : u32;
  let x_18 : u32 = gl_LocalInvocationID.x;
  let x_28 : u32 = gl_GlobalInvocationID.x;
  let x_32 : u32 = x_23.vals[(2u * x_28)];
  chunk[(2u * x_18)] = x_32;
  let x_36 : u32 = gl_LocalInvocationID.x;
  let x_41 : u32 = gl_GlobalInvocationID.x;
  let x_45 : u32 = x_23.vals[((2u * x_41) + 1u)];
  chunk[((2u * x_36) + 1u)] = x_45;
  offs = 1u;
  d = 256i;
  loop {
    let x_57 : i32 = d;
    if ((x_57 > 0i)) {
    } else {
      break;
    }
    workgroupBarrier();
    let x_62 : u32 = gl_LocalInvocationID.x;
    let x_63 : i32 = d;
    if ((x_62 < bitcast<u32>(x_63))) {
      let x_69 : u32 = offs;
      let x_71 : u32 = gl_LocalInvocationID.x;
      a = ((x_69 * ((2u * x_71) + 1u)) - 1u);
      let x_77 : u32 = offs;
      let x_79 : u32 = gl_LocalInvocationID.x;
      b = ((x_77 * ((2u * x_79) + 2u)) - 1u);
      let x_84 : u32 = b;
      let x_85 : u32 = a;
      let x_87 : u32 = chunk[x_85];
      let x_89 : u32 = chunk[x_84];
      chunk[x_84] = (x_89 + x_87);
    }
    let x_92 : u32 = offs;
    offs = (x_92 << bitcast<u32>(1i));

    continuing {
      let x_95 : i32 = d;
      d = (x_95 >> bitcast<u32>(1i));
    }
  }
  let x_98 : u32 = gl_LocalInvocationID.x;
  if ((x_98 == 0u)) {
    let x_108 : u32 = gl_WorkGroupID.x;
    let x_111 : u32 = chunk[511i];
    x_105.block_sums[x_108] = x_111;
    chunk[511i] = 0u;
  }
  d_1 = 1i;
  loop {
    let x_120 : i32 = d_1;
    if ((x_120 < 512i)) {
    } else {
      break;
    }
    let x_123 : u32 = offs;
    offs = (x_123 >> bitcast<u32>(1i));
    workgroupBarrier();
    let x_126 : u32 = gl_LocalInvocationID.x;
    let x_127 : i32 = d_1;
    if ((x_126 < bitcast<u32>(x_127))) {
      let x_133 : u32 = offs;
      let x_135 : u32 = gl_LocalInvocationID.x;
      a_1 = ((x_133 * ((2u * x_135) + 1u)) - 1u);
      let x_141 : u32 = offs;
      let x_143 : u32 = gl_LocalInvocationID.x;
      b_1 = ((x_141 * ((2u * x_143) + 2u)) - 1u);
      let x_149 : u32 = a_1;
      let x_151 : u32 = chunk[x_149];
      tmp = x_151;
      let x_152 : u32 = a_1;
      let x_153 : u32 = b_1;
      let x_155 : u32 = chunk[x_153];
      chunk[x_152] = x_155;
      let x_157 : u32 = b_1;
      let x_158 : u32 = tmp;
      let x_160 : u32 = chunk[x_157];
      chunk[x_157] = (x_160 + x_158);
    }

    continuing {
      let x_163 : i32 = d_1;
      d_1 = (x_163 << bitcast<u32>(1i));
    }
  }
  workgroupBarrier();
  let x_166 : u32 = gl_GlobalInvocationID.x;
  let x_169 : u32 = gl_LocalInvocationID.x;
  let x_172 : u32 = chunk[(2u * x_169)];
  x_23.vals[(2u * x_166)] = x_172;
  let x_175 : u32 = gl_GlobalInvocationID.x;
  let x_179 : u32 = gl_LocalInvocationID.x;
  let x_183 : u32 = chunk[((2u * x_179) + 1u)];
  x_23.vals[((2u * x_175) + 1u)] = x_183;
  return;
}

@compute @workgroup_size(256i, 1i, 1i)
fn main(@builtin(local_invocation_id) gl_LocalInvocationID_param : vec3<u32>, @builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>, @builtin(workgroup_id) gl_WorkGroupID_param : vec3<u32>) {
  gl_LocalInvocationID = gl_LocalInvocationID_param;
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  gl_WorkGroupID = gl_WorkGroupID_param;
  main_1();
}
`;

export const block_prefix_sum_comp_spv = `alias RTArr = array<u32>;

struct Data {
  vals : RTArr,
}

struct CarryInOut {
  carry_in : u32,
  carry_out : u32,
}

var<workgroup> chunk : array<u32, 512u>;

var<private> gl_LocalInvocationID : vec3<u32>;

@group(0) @binding(0) var<storage, read_write> x_23 : Data;

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(1) var<storage, read_write> x_104 : CarryInOut;

fn main_1() {
  var offs : u32;
  var d : i32;
  var a : u32;
  var b : u32;
  var d_1 : i32;
  var a_1 : u32;
  var b_1 : u32;
  var tmp : u32;
  let x_18 : u32 = gl_LocalInvocationID.x;
  let x_28 : u32 = gl_GlobalInvocationID.x;
  let x_32 : u32 = x_23.vals[(2u * x_28)];
  chunk[(2u * x_18)] = x_32;
  let x_36 : u32 = gl_LocalInvocationID.x;
  let x_41 : u32 = gl_GlobalInvocationID.x;
  let x_45 : u32 = x_23.vals[((2u * x_41) + 1u)];
  chunk[((2u * x_36) + 1u)] = x_45;
  offs = 1u;
  d = 256i;
  loop {
    let x_57 : i32 = d;
    if ((x_57 > 0i)) {
    } else {
      break;
    }
    workgroupBarrier();
    let x_62 : u32 = gl_LocalInvocationID.x;
    let x_63 : i32 = d;
    if ((x_62 < bitcast<u32>(x_63))) {
      let x_69 : u32 = offs;
      let x_71 : u32 = gl_LocalInvocationID.x;
      a = ((x_69 * ((2u * x_71) + 1u)) - 1u);
      let x_77 : u32 = offs;
      let x_79 : u32 = gl_LocalInvocationID.x;
      b = ((x_77 * ((2u * x_79) + 2u)) - 1u);
      let x_84 : u32 = b;
      let x_85 : u32 = a;
      let x_87 : u32 = chunk[x_85];
      let x_89 : u32 = chunk[x_84];
      chunk[x_84] = (x_89 + x_87);
    }
    let x_92 : u32 = offs;
    offs = (x_92 << bitcast<u32>(1i));

    continuing {
      let x_95 : i32 = d;
      d = (x_95 >> bitcast<u32>(1i));
    }
  }
  let x_98 : u32 = gl_LocalInvocationID.x;
  if ((x_98 == 0u)) {
    let x_107 : u32 = chunk[511i];
    let x_109 : u32 = x_104.carry_in;
    x_104.carry_out = (x_107 + x_109);
    chunk[511i] = 0u;
  }
  d_1 = 1i;
  loop {
    let x_119 : i32 = d_1;
    if ((x_119 < 512i)) {
    } else {
      break;
    }
    let x_122 : u32 = offs;
    offs = (x_122 >> bitcast<u32>(1i));
    workgroupBarrier();
    let x_125 : u32 = gl_LocalInvocationID.x;
    let x_126 : i32 = d_1;
    if ((x_125 < bitcast<u32>(x_126))) {
      let x_132 : u32 = offs;
      let x_134 : u32 = gl_LocalInvocationID.x;
      a_1 = ((x_132 * ((2u * x_134) + 1u)) - 1u);
      let x_140 : u32 = offs;
      let x_142 : u32 = gl_LocalInvocationID.x;
      b_1 = ((x_140 * ((2u * x_142) + 2u)) - 1u);
      let x_148 : u32 = a_1;
      let x_150 : u32 = chunk[x_148];
      tmp = x_150;
      let x_151 : u32 = a_1;
      let x_152 : u32 = b_1;
      let x_154 : u32 = chunk[x_152];
      chunk[x_151] = x_154;
      let x_156 : u32 = b_1;
      let x_157 : u32 = tmp;
      let x_159 : u32 = chunk[x_156];
      chunk[x_156] = (x_159 + x_157);
    }

    continuing {
      let x_162 : i32 = d_1;
      d_1 = (x_162 << bitcast<u32>(1i));
    }
  }
  workgroupBarrier();
  let x_165 : u32 = gl_GlobalInvocationID.x;
  let x_168 : u32 = gl_LocalInvocationID.x;
  let x_171 : u32 = chunk[(2u * x_168)];
  let x_173 : u32 = x_104.carry_in;
  x_23.vals[(2u * x_165)] = (x_171 + x_173);
  let x_177 : u32 = gl_GlobalInvocationID.x;
  let x_181 : u32 = gl_LocalInvocationID.x;
  let x_185 : u32 = chunk[((2u * x_181) + 1u)];
  let x_187 : u32 = x_104.carry_in;
  x_23.vals[((2u * x_177) + 1u)] = (x_185 + x_187);
  return;
}

@compute @workgroup_size(256i, 1i, 1i)
fn main(@builtin(local_invocation_id) gl_LocalInvocationID_param : vec3<u32>, @builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_LocalInvocationID = gl_LocalInvocationID_param;
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const add_block_sums_comp_spv = `alias RTArr = array<u32>;

alias RTArr_1 = array<u32>;

struct BlockSums {
  block_sums : RTArr_1,
}

struct Data {
  vals : RTArr_1,
}

@group(0) @binding(1) var<storage, read_write> x_12 : BlockSums;

var<private> gl_WorkGroupID : vec3<u32>;

@group(0) @binding(0) var<storage, read_write> x_28 : Data;

var<private> gl_GlobalInvocationID : vec3<u32>;

fn main_1() {
  var prev_sum : u32;
  let x_21 : u32 = gl_WorkGroupID.x;
  let x_24 : u32 = x_12.block_sums[x_21];
  prev_sum = x_24;
  let x_32 : u32 = gl_GlobalInvocationID.x;
  let x_33 : u32 = (2u * x_32);
  let x_34 : u32 = prev_sum;
  let x_36 : u32 = x_28.vals[x_33];
  x_28.vals[x_33] = (x_36 + x_34);
  let x_40 : u32 = gl_GlobalInvocationID.x;
  let x_43 : u32 = ((2u * x_40) + 1u);
  let x_44 : u32 = prev_sum;
  let x_46 : u32 = x_28.vals[x_43];
  x_28.vals[x_43] = (x_46 + x_44);
  return;
}

@compute @workgroup_size(256i, 1i, 1i)
fn main(@builtin(workgroup_id) gl_WorkGroupID_param : vec3<u32>, @builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_WorkGroupID = gl_WorkGroupID_param;
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const stream_compact_comp_spv = `alias RTArr = array<u32>;

alias RTArr_1 = array<u32>;

struct Input {
  inputs : RTArr_1,
}

alias RTArr_2 = array<u32>;

struct Output {
  outputs : RTArr_1,
}

struct Offsets {
  offsets : RTArr_1,
}

struct CompactionOffset {
  compact_offset : u32,
}

@group(0) @binding(0) var<storage, read_write> x_10 : Input;

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(3) var<storage, read_write> x_30 : Output;

@group(0) @binding(1) var<storage, read_write> x_34 : Offsets;

@group(0) @binding(2) var<uniform> x_43 : CompactionOffset;

fn main_1() {
  let x_19 : u32 = gl_GlobalInvocationID.x;
  let x_22 : u32 = x_10.inputs[x_19];
  if ((x_22 != 0u)) {
    let x_36 : u32 = gl_GlobalInvocationID.x;
    let x_38 : u32 = x_34.offsets[x_36];
    let x_40 : u32 = gl_GlobalInvocationID.x;
    let x_45 : u32 = x_43.compact_offset;
    x_30.outputs[x_38] = (x_40 + x_45);
  }
  return;
}

@compute @workgroup_size(8i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const stream_compact_data_comp_spv = `struct CompactionOffset {
  compact_offset : u32,
}

alias RTArr = array<u32>;

alias RTArr_1 = array<u32>;

struct Input {
  inputs : RTArr_1,
}

alias RTArr_2 = array<u32>;

struct Output {
  outputs : RTArr_1,
}

alias RTArr_3 = array<u32>;

struct Offsets {
  offsets : RTArr_1,
}

struct Data {
  input_data : RTArr_1,
}

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(2) var<uniform> x_18 : CompactionOffset;

@group(0) @binding(0) var<storage, read_write> x_28 : Input;

@group(0) @binding(3) var<storage, read_write> x_39 : Output;

@group(0) @binding(1) var<storage, read_write> x_43 : Offsets;

@group(1) @binding(0) var<storage, read_write> x_50 : Data;

fn main_1() {
  var i : u32;
  let x_15 : u32 = gl_GlobalInvocationID.x;
  let x_23 : u32 = x_18.compact_offset;
  i = (x_15 + x_23);
  let x_29 : u32 = i;
  let x_31 : u32 = x_28.inputs[x_29];
  if ((x_31 != 0u)) {
    let x_44 : u32 = i;
    let x_46 : u32 = x_43.offsets[x_44];
    let x_51 : u32 = i;
    let x_53 : u32 = x_50.input_data[x_51];
    x_39.outputs[x_46] = x_53;
  }
  return;
}

@compute @workgroup_size(8i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const compute_initial_rays_vert_spv = `struct VolumeParams {
  volume_dims : vec4<u32>,
  padded_dims : vec4<u32>,
  volume_scale : vec4<f32>,
  max_bits : u32,
  isovalue : f32,
  image_width : u32,
}

struct ViewParams {
  proj_view : mat4x4<f32>,
  eye_pos : vec4<f32>,
  eye_dir : vec4<f32>,
  near_plane : f32,
}

@group(0) @binding(2) var<uniform> x_17 : VolumeParams;

@group(0) @binding(0) var<uniform> x_36 : ViewParams;

var<private> pos : vec3<f32>;

var<private> transformed_eye : vec3<f32>;

var<private> vray_dir : vec3<f32>;

var<private> gl_Position : vec4<f32>;

fn main_1() {
  var volume_translation : vec3<f32>;
  let x_22 : vec4<f32> = x_17.volume_scale;
  volume_translation = (vec3<f32>(0.0f, 0.0f, 0.0f) - (vec3<f32>(x_22.x, x_22.y, x_22.z) * 0.5f));
  let x_39 : mat4x4<f32> = x_36.proj_view;
  let x_42 : vec3<f32> = pos;
  let x_44 : vec4<f32> = x_17.volume_scale;
  let x_47 : vec3<f32> = volume_translation;
  let x_48 : vec3<f32> = ((x_42 * vec3<f32>(x_44.x, x_44.y, x_44.z)) + x_47);
  gl_Position = (x_39 * vec4<f32>(x_48.x, x_48.y, x_48.z, 1.0f));
  let x_61 : vec4<f32> = x_36.eye_pos;
  let x_63 : vec3<f32> = volume_translation;
  let x_66 : vec4<f32> = x_17.volume_scale;
  transformed_eye = ((vec3<f32>(x_61.x, x_61.y, x_61.z) - x_63) / vec3<f32>(x_66.x, x_66.y, x_66.z));
  let x_70 : vec3<f32> = pos;
  let x_71 : vec3<f32> = transformed_eye;
  vray_dir = (x_70 - x_71);
  return;
}

struct main_out {
  @builtin(position)
  gl_Position : vec4<f32>,
  @location(1) @interpolate(flat)
  transformed_eye_1 : vec3<f32>,
  @location(0)
  vray_dir_1 : vec3<f32>,
}

@vertex
fn main(@location(0) pos_param : vec3<f32>) -> main_out {
  pos = pos_param;
  main_1();
  return main_out(gl_Position, transformed_eye, vray_dir);
}
`;

export const compute_initial_rays_frag_spv = `struct VolumeParams {
  volume_dims : vec4<u32>,
  padded_dims : vec4<u32>,
  volume_scale : vec4<f32>,
  max_bits : u32,
  isovalue : f32,
  image_width : u32,
}

struct RayInfo {
  ray_dir : vec3<f32>,
  t : f32,
}

alias RTArr = array<RayInfo>;

struct RayInformation {
  rays : RTArr,
}

alias RTArr_1 = array<u32>;

struct RayBlockIDs {
  block_ids : RTArr_1,
}

var<private> vray_dir : vec3<f32>;

var<private> transformed_eye : vec3<f32>;

@group(0) @binding(2) var<uniform> x_80 : VolumeParams;

var<private> gl_FragCoord : vec4<f32>;

@group(0) @binding(1) var<storage, read_write> x_149 : RayInformation;

@group(0) @binding(3) var<storage, read_write> x_157 : RayBlockIDs;

fn intersect_box_vf3_vf3_vf3_vf3_(orig : ptr<function, vec3<f32>>, dir : ptr<function, vec3<f32>>, box_min : vec3<f32>, box_max : vec3<f32>) -> vec2<f32> {
  var inv_dir : vec3<f32>;
  var tmin_tmp : vec3<f32>;
  var tmax_tmp : vec3<f32>;
  var tmin : vec3<f32>;
  var tmax : vec3<f32>;
  var t0 : f32;
  var t1 : f32;
  let x_19 : vec3<f32> = *(dir);
  inv_dir = (vec3<f32>(1.0f, 1.0f, 1.0f) / x_19);
  let x_23 : vec3<f32> = *(orig);
  let x_25 : vec3<f32> = inv_dir;
  tmin_tmp = ((box_min - x_23) * x_25);
  let x_28 : vec3<f32> = *(orig);
  let x_30 : vec3<f32> = inv_dir;
  tmax_tmp = ((box_max - x_28) * x_30);
  let x_33 : vec3<f32> = tmin_tmp;
  let x_34 : vec3<f32> = tmax_tmp;
  tmin = min(x_33, x_34);
  let x_37 : vec3<f32> = tmin_tmp;
  let x_38 : vec3<f32> = tmax_tmp;
  tmax = max(x_37, x_38);
  let x_45 : f32 = tmin.x;
  let x_48 : f32 = tmin.y;
  let x_51 : f32 = tmin.z;
  t0 = max(x_45, max(x_48, x_51));
  let x_56 : f32 = tmax.x;
  let x_58 : f32 = tmax.y;
  let x_60 : f32 = tmax.z;
  t1 = min(x_56, min(x_58, x_60));
  let x_63 : f32 = t0;
  let x_64 : f32 = t1;
  return vec2<f32>(x_63, x_64);
}

fn main_1() {
  var ray_dir : vec3<f32>;
  var vol_eye : vec3<f32>;
  var grid_ray_dir : vec3<f32>;
  var t_hit : vec2<f32>;
  var param : vec3<f32>;
  var param_1 : vec3<f32>;
  var pixel : u32;
  let x_71 : vec3<f32> = vray_dir;
  ray_dir = normalize(x_71);
  let x_75 : vec3<f32> = transformed_eye;
  let x_86 : vec4<u32> = x_80.volume_dims;
  vol_eye = ((x_75 * vec3<f32>(vec3<u32>(x_86.x, x_86.y, x_86.z))) - vec3<f32>(0.5f, 0.5f, 0.5f));
  let x_94 : vec3<f32> = ray_dir;
  let x_96 : vec4<u32> = x_80.volume_dims;
  grid_ray_dir = normalize((x_94 * vec3<f32>(vec3<u32>(x_96.x, x_96.y, x_96.z))));
  let x_106 : vec4<u32> = x_80.volume_dims;
  let x_112 : vec3<f32> = vol_eye;
  param = x_112;
  let x_114 : vec3<f32> = grid_ray_dir;
  param_1 = x_114;
  let x_115 : vec2<f32> = intersect_box_vf3_vf3_vf3_vf3_(&(param), &(param_1), vec3<f32>(0.0f, 0.0f, 0.0f), vec3<f32>((vec3<u32>(x_106.x, x_106.y, x_106.z) - vec3<u32>(1u, 1u, 1u))));
  t_hit = x_115;
  let x_117 : f32 = t_hit.x;
  t_hit.x = max(x_117, 0.0f);
  let x_126 : f32 = gl_FragCoord.x;
  let x_131 : u32 = x_80.image_width;
  let x_133 : f32 = gl_FragCoord.y;
  pixel = (u32(x_126) + (x_131 * u32(x_133)));
  let x_138 : f32 = t_hit.x;
  let x_140 : f32 = t_hit.y;
  if ((x_138 < x_140)) {
    let x_150 : u32 = pixel;
    let x_151 : vec3<f32> = grid_ray_dir;
    x_149.rays[x_150].ray_dir = x_151;
    let x_158 : u32 = pixel;
    x_157.block_ids[x_158] = 4294967295u;
    let x_161 : u32 = pixel;
    let x_164 : f32 = t_hit.x;
    x_149.rays[x_161].t = x_164;
  }
  return;
}

@fragment
fn main(@location(0) vray_dir_param : vec3<f32>, @location(1) @interpolate(flat) transformed_eye_param : vec3<f32>, @builtin(position) gl_FragCoord_param : vec4<f32>) {
  vray_dir = vray_dir_param;
  transformed_eye = transformed_eye_param;
  gl_FragCoord = gl_FragCoord_param;
  main_1();
}
`;

export const zfp_compute_block_range_comp_spv = `struct EmulateUint64 {
  lo : u32,
  hi : u32,
}

struct BlockReader {
  current_bit : u32,
  current_word : u32,
  word_buffer : EmulateUint64,
}

struct VolumeParams {
  volume_dims : vec4<u32>,
  padded_dims : vec4<u32>,
  volume_scale : vec4<f32>,
  max_bits : u32,
  isovalue : f32,
  image_width : u32,
}

struct EmulateUint64_1 {
  lo : u32,
  hi : u32,
}

alias RTArr = array<EmulateUint64_1>;

struct Compressed {
  compressed : RTArr,
}

struct BlockIDOffset {
  block_id_offset : u32,
}

alias RTArr_1 = array<vec2<f32>>;

struct BlockInformation {
  block_ranges : RTArr_1,
}

@group(0) @binding(1) var<uniform> x_240 : VolumeParams;

@group(0) @binding(0) var<storage, read_write> x_270 : Compressed;

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(1) @binding(0) var<uniform> x_872 : BlockIDOffset;

@group(0) @binding(2) var<storage, read_write> x_1073 : BlockInformation;

fn shift_right_struct_EmulateUint64_u1_u11_u1_(a_3 : EmulateUint64, n_1 : ptr<function, u32>) -> EmulateUint64 {
  var carry_1 : u32;
  var b_3 : EmulateUint64;
  let x_167 : u32 = *(n_1);
  if ((x_167 == 0u)) {
    return a_3;
  }
  let x_172 : u32 = *(n_1);
  if ((x_172 < 32u)) {
    let x_178 : u32 = *(n_1);
    carry_1 = (a_3.hi & (4294967295u >> (32u - x_178)));
    let x_184 : u32 = *(n_1);
    let x_186 : u32 = carry_1;
    let x_187 : u32 = *(n_1);
    b_3.lo = ((a_3.lo >> x_184) | (x_186 << (32u - x_187)));
    let x_193 : u32 = *(n_1);
    b_3.hi = (a_3.hi >> x_193);
  } else {
    let x_198 : u32 = *(n_1);
    b_3.lo = (a_3.hi >> (x_198 - 32u));
    b_3.hi = 0u;
  }
  let x_203 : EmulateUint64 = b_3;
  return x_203;
}

fn create_block_reader_u1_(block_index : ptr<function, u32>) -> BlockReader {
  var reader_5 : BlockReader;
  var param_2 : u32;
  let x_244 : u32 = x_240.max_bits;
  if ((x_244 != 64u)) {
    let x_249 : u32 = *(block_index);
    let x_251 : u32 = x_240.max_bits;
    reader_5.current_word = ((x_249 * x_251) / 64u);
    let x_255 : u32 = *(block_index);
    let x_257 : u32 = x_240.max_bits;
    reader_5.current_bit = ((x_255 * x_257) % 64u);
  } else {
    let x_262 : u32 = *(block_index);
    reader_5.current_word = x_262;
    reader_5.current_bit = 0u;
  }
  let x_272 : u32 = reader_5.current_word;
  let x_275 : EmulateUint64_1 = x_270.compressed[x_272];
  reader_5.word_buffer.lo = x_275.lo;
  reader_5.word_buffer.hi = x_275.hi;
  let x_282 : EmulateUint64 = reader_5.word_buffer;
  let x_285 : u32 = reader_5.current_bit;
  param_2 = x_285;
  let x_286 : EmulateUint64 = shift_right_struct_EmulateUint64_u1_u11_u1_(x_282, &(param_2));
  reader_5.word_buffer = x_286;
  let x_288 : BlockReader = reader_5;
  return x_288;
}

fn advance_word_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_(reader : ptr<function, BlockReader>) {
  (*(reader)).current_bit = 0u;
  let x_293 : u32 = (*(reader)).current_word;
  (*(reader)).current_word = (x_293 + bitcast<u32>(1i));
  let x_296 : u32 = (*(reader)).current_word;
  let x_298 : EmulateUint64_1 = x_270.compressed[x_296];
  (*(reader)).word_buffer.lo = x_298.lo;
  (*(reader)).word_buffer.hi = x_298.hi;
  return;
}

fn read_bit_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_(reader_1 : ptr<function, BlockReader>) -> u32 {
  var bit : u32;
  var param_3 : u32;
  var param_4 : BlockReader;
  let x_306 : u32 = (*(reader_1)).word_buffer.lo;
  bit = (x_306 & 1u);
  let x_310 : u32 = (*(reader_1)).current_bit;
  (*(reader_1)).current_bit = (x_310 + bitcast<u32>(1i));
  let x_313 : EmulateUint64 = (*(reader_1)).word_buffer;
  param_3 = 1u;
  let x_315 : EmulateUint64 = shift_right_struct_EmulateUint64_u1_u11_u1_(x_313, &(param_3));
  (*(reader_1)).word_buffer = x_315;
  let x_318 : u32 = (*(reader_1)).current_bit;
  if ((x_318 >= 64u)) {
    let x_323 : BlockReader = *(reader_1);
    param_4 = x_323;
    advance_word_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_(&(param_4));
    let x_325 : BlockReader = param_4;
    *(reader_1) = x_325;
  }
  let x_326 : u32 = bit;
  return x_326;
}

fn make_emulate_uint64_u1_u1_(hi : ptr<function, u32>, lo : ptr<function, u32>) -> EmulateUint64 {
  var a_4 : EmulateUint64;
  let x_92 : u32 = *(lo);
  a_4.lo = x_92;
  let x_95 : u32 = *(hi);
  a_4.hi = x_95;
  let x_97 : EmulateUint64 = a_4;
  return x_97;
}

fn make_mask_u1_(n_2 : ptr<function, u32>) -> EmulateUint64 {
  var a_5 : EmulateUint64;
  var param : u32;
  var param_1 : u32;
  param = 0u;
  param_1 = 0u;
  let x_209 : EmulateUint64 = make_emulate_uint64_u1_u1_(&(param), &(param_1));
  a_5 = x_209;
  let x_210 : u32 = *(n_2);
  let x_212 : u32 = *(n_2);
  if (((x_210 > 0u) & (x_212 < 65u))) {
    let x_218 : u32 = *(n_2);
    if ((x_218 > 32u)) {
      a_5.lo = 4294967295u;
      let x_223 : u32 = *(n_2);
      a_5.hi = (4294967295u >> (64u - x_223));
    } else {
      let x_228 : u32 = *(n_2);
      a_5.lo = (4294967295u >> (32u - x_228));
      a_5.hi = 0u;
    }
  }
  let x_233 : EmulateUint64 = a_5;
  return x_233;
}

fn bitwise_and_struct_EmulateUint64_u1_u11_struct_EmulateUint64_u1_u11_(a : EmulateUint64, b : EmulateUint64) -> EmulateUint64 {
  var c : EmulateUint64;
  c.lo = (a.lo & b.lo);
  c.hi = (a.hi & b.hi);
  let x_109 : EmulateUint64 = c;
  return x_109;
}

fn shift_left_struct_EmulateUint64_u1_u11_u1_(a_2 : EmulateUint64, n : ptr<function, u32>) -> EmulateUint64 {
  var carry : u32;
  var b_2 : EmulateUint64;
  let x_124 : u32 = *(n);
  if ((x_124 == 0u)) {
    return a_2;
  }
  let x_131 : u32 = *(n);
  if ((x_131 < 32u)) {
    let x_139 : u32 = *(n);
    carry = (a_2.lo & (4294967295u << (32u - x_139)));
    let x_145 : u32 = *(n);
    b_2.lo = (a_2.lo << x_145);
    let x_149 : u32 = *(n);
    let x_151 : u32 = carry;
    let x_152 : u32 = *(n);
    b_2.hi = ((a_2.hi << x_149) | (x_151 >> (32u - x_152)));
  } else {
    b_2.lo = 0u;
    let x_160 : u32 = *(n);
    b_2.hi = (a_2.lo << (x_160 - 32u));
  }
  let x_164 : EmulateUint64 = b_2;
  return x_164;
}

fn bitwise_or_struct_EmulateUint64_u1_u11_struct_EmulateUint64_u1_u11_(a_1 : EmulateUint64, b_1 : EmulateUint64) -> EmulateUint64 {
  var c_1 : EmulateUint64;
  c_1.lo = (a_1.lo | b_1.lo);
  c_1.hi = (a_1.hi | b_1.hi);
  let x_121 : EmulateUint64 = c_1;
  return x_121;
}

fn read_bits_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_u1_(reader_2 : ptr<function, BlockReader>, n_bits : u32) -> EmulateUint64 {
  var rem_bits : u32;
  var first_read : u32;
  var mask : EmulateUint64;
  var param_5 : u32;
  var bits : EmulateUint64;
  var param_6 : u32;
  var next_read : u32;
  var param_7 : BlockReader;
  var param_8 : u32;
  var param_9 : u32;
  var param_10 : u32;
  let x_331 : u32 = (*(reader_2)).current_bit;
  rem_bits = (64u - x_331);
  let x_334 : u32 = rem_bits;
  first_read = min(x_334, n_bits);
  let x_338 : u32 = first_read;
  param_5 = x_338;
  let x_339 : EmulateUint64 = make_mask_u1_(&(param_5));
  mask = x_339;
  let x_342 : EmulateUint64 = (*(reader_2)).word_buffer;
  let x_343 : EmulateUint64 = mask;
  let x_344 : EmulateUint64 = bitwise_and_struct_EmulateUint64_u1_u11_struct_EmulateUint64_u1_u11_(x_342, x_343);
  bits = x_344;
  let x_346 : EmulateUint64 = (*(reader_2)).word_buffer;
  param_6 = n_bits;
  let x_348 : EmulateUint64 = shift_right_struct_EmulateUint64_u1_u11_u1_(x_346, &(param_6));
  (*(reader_2)).word_buffer = x_348;
  let x_350 : u32 = first_read;
  let x_352 : u32 = (*(reader_2)).current_bit;
  (*(reader_2)).current_bit = (x_352 + x_350);
  next_read = 0u;
  let x_356 : u32 = rem_bits;
  if ((n_bits >= x_356)) {
    let x_361 : BlockReader = *(reader_2);
    param_7 = x_361;
    advance_word_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_(&(param_7));
    let x_363 : BlockReader = param_7;
    *(reader_2) = x_363;
    let x_364 : u32 = first_read;
    next_read = (n_bits - x_364);
  }
  let x_367 : u32 = next_read;
  param_8 = x_367;
  let x_368 : EmulateUint64 = make_mask_u1_(&(param_8));
  mask = x_368;
  let x_369 : EmulateUint64 = bits;
  let x_371 : EmulateUint64 = (*(reader_2)).word_buffer;
  let x_372 : EmulateUint64 = mask;
  let x_373 : EmulateUint64 = bitwise_and_struct_EmulateUint64_u1_u11_struct_EmulateUint64_u1_u11_(x_371, x_372);
  let x_375 : u32 = first_read;
  param_9 = x_375;
  let x_376 : EmulateUint64 = shift_left_struct_EmulateUint64_u1_u11_u1_(x_373, &(param_9));
  let x_377 : EmulateUint64 = bitwise_or_struct_EmulateUint64_u1_u11_struct_EmulateUint64_u1_u11_(x_369, x_376);
  bits = x_377;
  let x_379 : EmulateUint64 = (*(reader_2)).word_buffer;
  let x_381 : u32 = next_read;
  param_10 = x_381;
  let x_382 : EmulateUint64 = shift_right_struct_EmulateUint64_u1_u11_u1_(x_379, &(param_10));
  (*(reader_2)).word_buffer = x_382;
  let x_384 : u32 = next_read;
  let x_386 : u32 = (*(reader_2)).current_bit;
  (*(reader_2)).current_bit = (x_386 + x_384);
  let x_389 : EmulateUint64 = bits;
  return x_389;
}

fn decode_ints_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_u1_u1_64__(reader_3 : ptr<function, BlockReader>, block_max_bits : u32, block_1 : ptr<function, array<u32, 64u>>) {
  var i : u32;
  var x_1 : EmulateUint64;
  var param_11 : u32;
  var param_12 : u32;
  var one : EmulateUint64;
  var param_13 : u32;
  var param_14 : u32;
  var bits_1 : u32;
  var k : u32;
  var n_3 : u32;
  var m : u32;
  var param_15 : BlockReader;
  var param_16 : BlockReader;
  var param_17 : BlockReader;
  var param_18 : u32;
  var i_1 : u32;
  var param_19 : u32;
  i = 0u;
  loop {
    let x_405 : u32 = i;
    if ((x_405 < 64u)) {
    } else {
      break;
    }
    let x_407 : u32 = i;
    (*(block_1))[x_407] = 0u;

    continuing {
      let x_409 : u32 = i;
      i = (x_409 + bitcast<u32>(1i));
    }
  }
  param_11 = 0u;
  param_12 = 0u;
  let x_414 : EmulateUint64 = make_emulate_uint64_u1_u1_(&(param_11), &(param_12));
  x_1 = x_414;
  param_13 = 0u;
  param_14 = 1u;
  let x_418 : EmulateUint64 = make_emulate_uint64_u1_u1_(&(param_13), &(param_14));
  one = x_418;
  bits_1 = block_max_bits;
  k = 32u;
  n_3 = 0u;
  loop {
    var x_433 : bool;
    var x_434 : bool;
    let x_427 : u32 = bits_1;
    let x_428 : bool = (x_427 != 0u);
    x_434 = x_428;
    if (x_428) {
      let x_431 : u32 = k;
      k = (x_431 - bitcast<u32>(1i));
      x_433 = (x_431 > 0u);
      x_434 = x_433;
    }
    if (x_434) {
    } else {
      break;
    }
    let x_436 : u32 = n_3;
    let x_437 : u32 = bits_1;
    m = min(x_436, x_437);
    let x_439 : u32 = m;
    let x_440 : u32 = bits_1;
    bits_1 = (x_440 - x_439);
    let x_442 : u32 = m;
    let x_444 : BlockReader = *(reader_3);
    param_15 = x_444;
    let x_445 : EmulateUint64 = read_bits_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_u1_(&(param_15), x_442);
    let x_446 : BlockReader = param_15;
    *(reader_3) = x_446;
    x_1 = x_445;
    loop {
      var x_465 : bool;
      var x_466 : bool;
      let x_452 : u32 = n_3;
      let x_454 : u32 = bits_1;
      let x_456 : bool = ((x_452 < 64u) & (x_454 != 0u));
      x_466 = x_456;
      if (x_456) {
        let x_459 : u32 = bits_1;
        bits_1 = (x_459 - bitcast<u32>(1i));
        let x_462 : BlockReader = *(reader_3);
        param_16 = x_462;
        let x_463 : u32 = read_bit_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_(&(param_16));
        let x_464 : BlockReader = param_16;
        *(reader_3) = x_464;
        x_465 = (x_463 != 0u);
        x_466 = x_465;
      }
      if (x_466) {
      } else {
        break;
      }
      loop {
        var x_486 : bool;
        var x_487 : bool;
        let x_472 : u32 = n_3;
        let x_475 : u32 = bits_1;
        let x_477 : bool = ((x_472 < 63u) & (x_475 != 0u));
        x_487 = x_477;
        if (x_477) {
          let x_480 : u32 = bits_1;
          bits_1 = (x_480 - bitcast<u32>(1i));
          let x_483 : BlockReader = *(reader_3);
          param_17 = x_483;
          let x_484 : u32 = read_bit_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_(&(param_17));
          let x_485 : BlockReader = param_17;
          *(reader_3) = x_485;
          x_486 = (x_484 == 0u);
          x_487 = x_486;
        }
        if (x_487) {
        } else {
          break;
        }

        continuing {
          let x_488 : u32 = n_3;
          n_3 = (x_488 + bitcast<u32>(1i));
        }
      }

      continuing {
        let x_490 : EmulateUint64 = x_1;
        let x_491 : EmulateUint64 = one;
        let x_492 : u32 = n_3;
        n_3 = (x_492 + bitcast<u32>(1i));
        param_18 = x_492;
        let x_495 : EmulateUint64 = shift_left_struct_EmulateUint64_u1_u11_u1_(x_491, &(param_18));
        let x_496 : EmulateUint64 = bitwise_or_struct_EmulateUint64_u1_u11_struct_EmulateUint64_u1_u11_(x_490, x_495);
        x_1 = x_496;
      }
    }
    i_1 = 0u;
    loop {
      let x_503 : u32 = i_1;
      if ((x_503 < 64u)) {
      } else {
        break;
      }
      let x_505 : u32 = i_1;
      let x_507 : u32 = x_1.lo;
      let x_509 : u32 = k;
      let x_512 : u32 = (*(block_1))[x_505];
      (*(block_1))[x_505] = (x_512 + ((x_507 & 1u) << x_509));

      continuing {
        let x_515 : u32 = i_1;
        i_1 = (x_515 + bitcast<u32>(1i));
        let x_517 : EmulateUint64 = x_1;
        param_19 = 1u;
        let x_519 : EmulateUint64 = shift_right_struct_EmulateUint64_u1_u11_u1_(x_517, &(param_19));
        x_1 = x_519;
      }
    }
  }
  return;
}

fn uint2int_u1_(x : ptr<function, u32>) -> i32 {
  let x_392 : u32 = *(x);
  return bitcast<i32>(((x_392 ^ 2863311530u) - 2863311530u));
}

fn inverse_lift_i1_64__u1_u1_(block_2 : ptr<function, array<i32, 64u>>, s : u32, idx : u32) {
  var i_2 : u32;
  var v : vec4<i32>;
  var i_3 : u32;
  i_2 = 0u;
  loop {
    let x_526 : u32 = i_2;
    if ((x_526 < 4u)) {
    } else {
      break;
    }
    let x_532 : u32 = i_2;
    let x_533 : u32 = i_2;
    let x_538 : i32 = (*(block_2))[(idx + (x_533 * s))];
    v[x_532] = x_538;

    continuing {
      let x_540 : u32 = i_2;
      i_2 = (x_540 + bitcast<u32>(1i));
    }
  }
  let x_544 : i32 = v.w;
  let x_547 : i32 = v.y;
  v.y = (x_547 + (x_544 >> bitcast<u32>(1i)));
  let x_551 : i32 = v.y;
  let x_554 : i32 = v.w;
  v.w = (x_554 - (x_551 >> bitcast<u32>(1i)));
  let x_558 : i32 = v.w;
  let x_560 : i32 = v.y;
  v.y = (x_560 + x_558);
  let x_564 : i32 = v.w;
  v.w = (x_564 << bitcast<u32>(1i));
  let x_568 : i32 = v.y;
  let x_570 : i32 = v.w;
  v.w = (x_570 - x_568);
  let x_574 : i32 = v.x;
  let x_577 : i32 = v.z;
  v.z = (x_577 + x_574);
  let x_581 : i32 = v.x;
  v.x = (x_581 << bitcast<u32>(1i));
  let x_585 : i32 = v.z;
  let x_587 : i32 = v.x;
  v.x = (x_587 - x_585);
  let x_591 : i32 = v.z;
  let x_593 : i32 = v.y;
  v.y = (x_593 + x_591);
  let x_597 : i32 = v.z;
  v.z = (x_597 << bitcast<u32>(1i));
  let x_601 : i32 = v.y;
  let x_603 : i32 = v.z;
  v.z = (x_603 - x_601);
  let x_607 : i32 = v.x;
  let x_609 : i32 = v.w;
  v.w = (x_609 + x_607);
  let x_613 : i32 = v.x;
  v.x = (x_613 << bitcast<u32>(1i));
  let x_617 : i32 = v.w;
  let x_619 : i32 = v.x;
  v.x = (x_619 - x_617);
  i_3 = 0u;
  loop {
    let x_628 : u32 = i_3;
    if ((x_628 < 4u)) {
    } else {
      break;
    }
    let x_630 : u32 = i_3;
    let x_633 : u32 = i_3;
    let x_635 : i32 = v[x_633];
    (*(block_2))[(idx + (x_630 * s))] = x_635;

    continuing {
      let x_637 : u32 = i_3;
      i_3 = (x_637 + bitcast<u32>(1i));
    }
  }
  return;
}

fn inverse_transform_i1_64__(block_3 : ptr<function, array<i32, 64u>>) {
  var y : u32;
  var x_2 : u32;
  var param_20 : array<i32, 64u>;
  var x_3 : u32;
  var z : u32;
  var param_21 : array<i32, 64u>;
  var z_1 : u32;
  var y_1 : u32;
  var param_22 : array<i32, 64u>;
  y = 0u;
  loop {
    let x_645 : u32 = y;
    if ((x_645 < 4u)) {
    } else {
      break;
    }
    x_2 = 0u;
    loop {
      let x_653 : u32 = x_2;
      if ((x_653 < 4u)) {
      } else {
        break;
      }
      let x_656 : u32 = x_2;
      let x_657 : u32 = y;
      let x_661 : array<i32, 64u> = *(block_3);
      param_20 = x_661;
      inverse_lift_i1_64__u1_u1_(&(param_20), 16u, (x_656 + (4u * x_657)));
      let x_663 : array<i32, 64u> = param_20;
      *(block_3) = x_663;

      continuing {
        let x_664 : u32 = x_2;
        x_2 = (x_664 + bitcast<u32>(1i));
      }
    }

    continuing {
      let x_666 : u32 = y;
      y = (x_666 + bitcast<u32>(1i));
    }
  }
  x_3 = 0u;
  loop {
    let x_674 : u32 = x_3;
    if ((x_674 < 4u)) {
    } else {
      break;
    }
    z = 0u;
    loop {
      let x_682 : u32 = z;
      if ((x_682 < 4u)) {
      } else {
        break;
      }
      let x_684 : u32 = z;
      let x_686 : u32 = x_3;
      let x_689 : array<i32, 64u> = *(block_3);
      param_21 = x_689;
      inverse_lift_i1_64__u1_u1_(&(param_21), 4u, ((16u * x_684) + x_686));
      let x_691 : array<i32, 64u> = param_21;
      *(block_3) = x_691;

      continuing {
        let x_692 : u32 = z;
        z = (x_692 + bitcast<u32>(1i));
      }
    }

    continuing {
      let x_694 : u32 = x_3;
      x_3 = (x_694 + bitcast<u32>(1i));
    }
  }
  z_1 = 0u;
  loop {
    let x_702 : u32 = z_1;
    if ((x_702 < 4u)) {
    } else {
      break;
    }
    y_1 = 0u;
    loop {
      let x_710 : u32 = y_1;
      if ((x_710 < 4u)) {
      } else {
        break;
      }
      let x_712 : u32 = y_1;
      let x_714 : u32 = z_1;
      let x_718 : array<i32, 64u> = *(block_3);
      param_22 = x_718;
      inverse_lift_i1_64__u1_u1_(&(param_22), 1u, ((4u * x_712) + (16u * x_714)));
      let x_720 : array<i32, 64u> = param_22;
      *(block_3) = x_720;

      continuing {
        let x_721 : u32 = y_1;
        y_1 = (x_721 + bitcast<u32>(1i));
      }
    }

    continuing {
      let x_723 : u32 = z_1;
      z_1 = (x_723 + bitcast<u32>(1i));
    }
  }
  return;
}

fn decompress_block_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_f1_64__(reader_4 : ptr<function, BlockReader>, decompressed_block : ptr<function, array<f32, 64u>>) {
  var s_cont : u32;
  var param_23 : BlockReader;
  var emax : i32;
  var param_24 : BlockReader;
  var block_max_bits_1 : u32;
  var uint_block : array<u32, 64u>;
  var param_25 : BlockReader;
  var param_26 : array<u32, 64u>;
  var i_4 : u32;
  var int_block : array<i32, 64u>;
  var indexable : array<u32, 64u>;
  var param_27 : u32;
  var param_28 : array<i32, 64u>;
  var inv_w : f32;
  var i_5 : u32;
  let x_727 : BlockReader = *(reader_4);
  param_23 = x_727;
  let x_728 : u32 = read_bit_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_(&(param_23));
  let x_729 : BlockReader = param_23;
  *(reader_4) = x_729;
  s_cont = x_728;
  let x_730 : u32 = s_cont;
  if ((x_730 != 0u)) {
    let x_737 : BlockReader = *(reader_4);
    param_24 = x_737;
    let x_738 : EmulateUint64 = read_bits_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_u1_(&(param_24), 8u);
    let x_739 : BlockReader = param_24;
    *(reader_4) = x_739;
    emax = bitcast<i32>((x_738.lo - 127u));
    let x_746 : u32 = x_240.max_bits;
    block_max_bits_1 = (x_746 - 9u);
    let x_749 : u32 = block_max_bits_1;
    let x_752 : BlockReader = *(reader_4);
    param_25 = x_752;
    let x_754 : array<u32, 64u> = uint_block;
    param_26 = x_754;
    decode_ints_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_u1_u1_64__(&(param_25), x_749, &(param_26));
    let x_756 : BlockReader = param_25;
    *(reader_4) = x_756;
    let x_757 : array<u32, 64u> = param_26;
    uint_block = x_757;
    i_4 = 0u;
    loop {
      let x_764 : u32 = i_4;
      if ((x_764 < 64u)) {
      } else {
        break;
      }
      let x_822 : u32 = i_4;
      indexable = array<u32, 64u>(0u, 1u, 4u, 16u, 20u, 17u, 5u, 2u, 8u, 32u, 21u, 6u, 18u, 24u, 9u, 33u, 36u, 3u, 12u, 48u, 22u, 25u, 37u, 40u, 34u, 10u, 7u, 19u, 28u, 13u, 49u, 52u, 41u, 38u, 26u, 23u, 29u, 53u, 11u, 35u, 44u, 14u, 50u, 56u, 42u, 27u, 39u, 45u, 30u, 54u, 57u, 60u, 51u, 15u, 43u, 46u, 58u, 61u, 55u, 31u, 62u, 59u, 47u, 63u);
      let x_825 : u32 = indexable[x_822];
      let x_826 : u32 = i_4;
      let x_829 : u32 = uint_block[x_826];
      param_27 = x_829;
      let x_830 : i32 = uint2int_u1_(&(param_27));
      int_block[x_825] = x_830;

      continuing {
        let x_832 : u32 = i_4;
        i_4 = (x_832 + bitcast<u32>(1i));
      }
    }
    let x_835 : array<i32, 64u> = int_block;
    param_28 = x_835;
    inverse_transform_i1_64__(&(param_28));
    let x_837 : array<i32, 64u> = param_28;
    int_block = x_837;
    let x_841 : i32 = emax;
    inv_w = ldexp(1.0f, (x_841 - 30i));
    i_5 = 0u;
    loop {
      let x_851 : u32 = i_5;
      if ((x_851 < 64u)) {
      } else {
        break;
      }
      let x_853 : u32 = i_5;
      let x_854 : f32 = inv_w;
      let x_855 : u32 = i_5;
      let x_857 : i32 = int_block[x_855];
      (*(decompressed_block))[x_853] = (x_854 * f32(x_857));

      continuing {
        let x_861 : u32 = i_5;
        i_5 = (x_861 + bitcast<u32>(1i));
      }
    }
  }
  return;
}

fn main_1() {
  var block_index_1 : u32;
  var total_blocks : u32;
  var reader_6 : BlockReader;
  var param_29 : u32;
  var decompressed_block_1 : array<f32, 64u>;
  var param_30 : BlockReader;
  var param_31 : array<f32, 64u>;
  var stride : vec3<u32>;
  var nblocks : vec3<u32>;
  var block_4 : vec3<u32>;
  var block_range : vec2<f32>;
  var partial : vec3<bool>;
  var partial_size : vec3<u32>;
  var x_973 : u32;
  var x_985 : u32;
  var x_997 : u32;
  var z_2 : u32;
  var y_2 : u32;
  var x_4 : u32;
  let x_869 : u32 = gl_GlobalInvocationID.x;
  let x_874 : u32 = x_872.block_id_offset;
  block_index_1 = (x_869 + (x_874 * 32u));
  let x_879 : u32 = x_240.padded_dims.x;
  let x_881 : u32 = x_240.padded_dims.y;
  let x_885 : u32 = x_240.padded_dims.z;
  total_blocks = (((x_879 * x_881) / 64u) * x_885);
  let x_887 : u32 = block_index_1;
  let x_888 : u32 = total_blocks;
  if ((x_887 >= x_888)) {
    return;
  }
  let x_895 : u32 = block_index_1;
  param_29 = x_895;
  let x_896 : BlockReader = create_block_reader_u1_(&(param_29));
  reader_6 = x_896;
  let x_899 : BlockReader = reader_6;
  param_30 = x_899;
  let x_901 : array<f32, 64u> = decompressed_block_1;
  param_31 = x_901;
  decompress_block_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_f1_64__(&(param_30), &(param_31));
  let x_903 : array<f32, 64u> = param_31;
  decompressed_block_1 = x_903;
  let x_907 : u32 = x_240.volume_dims.x;
  let x_909 : u32 = x_240.volume_dims.x;
  let x_911 : u32 = x_240.volume_dims.y;
  stride = vec3<u32>(1u, x_907, (x_909 * x_911));
  let x_916 : u32 = x_240.padded_dims.x;
  nblocks.x = (x_916 >> bitcast<u32>(2i));
  let x_920 : u32 = x_240.padded_dims.y;
  nblocks.y = (x_920 >> bitcast<u32>(2i));
  let x_924 : u32 = x_240.padded_dims.z;
  nblocks.z = (x_924 >> bitcast<u32>(2i));
  let x_928 : u32 = block_index_1;
  let x_930 : u32 = nblocks.x;
  block_4.x = ((x_928 % x_930) * 4u);
  let x_934 : u32 = block_index_1;
  let x_936 : u32 = nblocks.x;
  let x_939 : u32 = nblocks.y;
  block_4.y = (((x_934 / x_936) % x_939) * 4u);
  let x_943 : u32 = block_index_1;
  let x_945 : u32 = nblocks.x;
  let x_947 : u32 = nblocks.y;
  block_4.z = ((x_943 / (x_945 * x_947)) * 4u);
  block_range = vec2<f32>(100000002004087734272.0f, -100000002004087734272.0f);
  let x_961 : vec3<u32> = block_4;
  let x_966 : vec4<u32> = x_240.volume_dims;
  partial = ((x_961 + vec3<u32>(4u, 4u, 4u)) > vec3<u32>(x_966.x, x_966.y, x_966.z));
  let x_972 : bool = partial.x;
  if (x_972) {
    let x_977 : u32 = x_240.volume_dims.x;
    let x_979 : u32 = block_4.x;
    x_973 = (x_977 - x_979);
  } else {
    x_973 = 4u;
  }
  let x_982 : u32 = x_973;
  let x_984 : bool = partial.y;
  if (x_984) {
    let x_989 : u32 = x_240.volume_dims.y;
    let x_991 : u32 = block_4.y;
    x_985 = (x_989 - x_991);
  } else {
    x_985 = 4u;
  }
  let x_994 : u32 = x_985;
  let x_996 : bool = partial.z;
  if (x_996) {
    let x_1001 : u32 = x_240.volume_dims.z;
    let x_1003 : u32 = block_4.z;
    x_997 = (x_1001 - x_1003);
  } else {
    x_997 = 4u;
  }
  let x_1006 : u32 = x_997;
  partial_size = vec3<u32>(x_982, x_994, x_1006);
  z_2 = 0u;
  loop {
    let x_1014 : u32 = z_2;
    let x_1016 : u32 = partial_size.z;
    if ((x_1014 < x_1016)) {
    } else {
      break;
    }
    y_2 = 0u;
    loop {
      let x_1024 : u32 = y_2;
      let x_1026 : u32 = partial_size.y;
      if ((x_1024 < x_1026)) {
      } else {
        break;
      }
      x_4 = 0u;
      loop {
        let x_1034 : u32 = x_4;
        let x_1036 : u32 = partial_size.x;
        if ((x_1034 < x_1036)) {
        } else {
          break;
        }
        let x_1039 : f32 = block_range.x;
        let x_1040 : u32 = z_2;
        let x_1042 : u32 = y_2;
        let x_1045 : u32 = x_4;
        let x_1048 : f32 = decompressed_block_1[(((16u * x_1040) + (4u * x_1042)) + x_1045)];
        block_range.x = min(x_1039, x_1048);
        let x_1052 : f32 = block_range.y;
        let x_1053 : u32 = z_2;
        let x_1055 : u32 = y_2;
        let x_1058 : u32 = x_4;
        let x_1061 : f32 = decompressed_block_1[(((16u * x_1053) + (4u * x_1055)) + x_1058)];
        block_range.y = max(x_1052, x_1061);

        continuing {
          let x_1064 : u32 = x_4;
          x_4 = (x_1064 + bitcast<u32>(1i));
        }
      }

      continuing {
        let x_1066 : u32 = y_2;
        y_2 = (x_1066 + bitcast<u32>(1i));
      }
    }

    continuing {
      let x_1068 : u32 = z_2;
      z_2 = (x_1068 + bitcast<u32>(1i));
    }
  }
  let x_1074 : u32 = block_index_1;
  let x_1075 : vec2<f32> = block_range;
  x_1073.block_ranges[x_1074] = x_1075;
  return;
}

@compute @workgroup_size(32i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const zfp_decompress_block_comp_spv = `struct EmulateUint64 {
  lo : u32,
  hi : u32,
}

struct BlockReader {
  current_bit : u32,
  current_word : u32,
  word_buffer : EmulateUint64,
}

struct VolumeParams {
  volume_dims : vec4<u32>,
  padded_dims : vec4<u32>,
  volume_scale : vec4<f32>,
  max_bits : u32,
  isovalue : f32,
  image_width : u32,
}

struct EmulateUint64_1 {
  lo : u32,
  hi : u32,
}

alias RTArr = array<EmulateUint64_1>;

struct Compressed {
  compressed : RTArr,
}

struct DecompressBlockOffset {
  start_block_offset : u32,
  total_n_blocks : u32,
}

alias RTArr_1 = array<u32>;

alias RTArr_2 = array<u32>;

struct BlockIDs {
  block_ids : RTArr_2,
}

struct CachedItemSlots {
  cached_item_slots : RTArr_2,
}

alias RTArr_3 = array<f32>;

struct Decompressed {
  decompressed : RTArr_3,
}

@group(0) @binding(1) var<uniform> x_240 : VolumeParams;

@group(0) @binding(0) var<storage, read_write> x_270 : Compressed;

@group(1) @binding(0) var<uniform> x_865 : DecompressBlockOffset;

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(3) var<storage, read_write> x_885 : BlockIDs;

@group(0) @binding(4) var<storage, read_write> x_897 : CachedItemSlots;

@group(0) @binding(2) var<storage, read_write> x_923 : Decompressed;

fn shift_right_struct_EmulateUint64_u1_u11_u1_(a_3 : EmulateUint64, n_1 : ptr<function, u32>) -> EmulateUint64 {
  var carry_1 : u32;
  var b_3 : EmulateUint64;
  let x_167 : u32 = *(n_1);
  if ((x_167 == 0u)) {
    return a_3;
  }
  let x_172 : u32 = *(n_1);
  if ((x_172 < 32u)) {
    let x_178 : u32 = *(n_1);
    carry_1 = (a_3.hi & (4294967295u >> (32u - x_178)));
    let x_184 : u32 = *(n_1);
    let x_186 : u32 = carry_1;
    let x_187 : u32 = *(n_1);
    b_3.lo = ((a_3.lo >> x_184) | (x_186 << (32u - x_187)));
    let x_193 : u32 = *(n_1);
    b_3.hi = (a_3.hi >> x_193);
  } else {
    let x_198 : u32 = *(n_1);
    b_3.lo = (a_3.hi >> (x_198 - 32u));
    b_3.hi = 0u;
  }
  let x_203 : EmulateUint64 = b_3;
  return x_203;
}

fn create_block_reader_u1_(block_index : ptr<function, u32>) -> BlockReader {
  var reader_5 : BlockReader;
  var param_2 : u32;
  let x_244 : u32 = x_240.max_bits;
  if ((x_244 != 64u)) {
    let x_249 : u32 = *(block_index);
    let x_251 : u32 = x_240.max_bits;
    reader_5.current_word = ((x_249 * x_251) / 64u);
    let x_255 : u32 = *(block_index);
    let x_257 : u32 = x_240.max_bits;
    reader_5.current_bit = ((x_255 * x_257) % 64u);
  } else {
    let x_262 : u32 = *(block_index);
    reader_5.current_word = x_262;
    reader_5.current_bit = 0u;
  }
  let x_272 : u32 = reader_5.current_word;
  let x_275 : EmulateUint64_1 = x_270.compressed[x_272];
  reader_5.word_buffer.lo = x_275.lo;
  reader_5.word_buffer.hi = x_275.hi;
  let x_282 : EmulateUint64 = reader_5.word_buffer;
  let x_285 : u32 = reader_5.current_bit;
  param_2 = x_285;
  let x_286 : EmulateUint64 = shift_right_struct_EmulateUint64_u1_u11_u1_(x_282, &(param_2));
  reader_5.word_buffer = x_286;
  let x_288 : BlockReader = reader_5;
  return x_288;
}

fn advance_word_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_(reader : ptr<function, BlockReader>) {
  (*(reader)).current_bit = 0u;
  let x_293 : u32 = (*(reader)).current_word;
  (*(reader)).current_word = (x_293 + bitcast<u32>(1i));
  let x_296 : u32 = (*(reader)).current_word;
  let x_298 : EmulateUint64_1 = x_270.compressed[x_296];
  (*(reader)).word_buffer.lo = x_298.lo;
  (*(reader)).word_buffer.hi = x_298.hi;
  return;
}

fn read_bit_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_(reader_1 : ptr<function, BlockReader>) -> u32 {
  var bit : u32;
  var param_3 : u32;
  var param_4 : BlockReader;
  let x_306 : u32 = (*(reader_1)).word_buffer.lo;
  bit = (x_306 & 1u);
  let x_310 : u32 = (*(reader_1)).current_bit;
  (*(reader_1)).current_bit = (x_310 + bitcast<u32>(1i));
  let x_313 : EmulateUint64 = (*(reader_1)).word_buffer;
  param_3 = 1u;
  let x_315 : EmulateUint64 = shift_right_struct_EmulateUint64_u1_u11_u1_(x_313, &(param_3));
  (*(reader_1)).word_buffer = x_315;
  let x_318 : u32 = (*(reader_1)).current_bit;
  if ((x_318 >= 64u)) {
    let x_323 : BlockReader = *(reader_1);
    param_4 = x_323;
    advance_word_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_(&(param_4));
    let x_325 : BlockReader = param_4;
    *(reader_1) = x_325;
  }
  let x_326 : u32 = bit;
  return x_326;
}

fn make_emulate_uint64_u1_u1_(hi : ptr<function, u32>, lo : ptr<function, u32>) -> EmulateUint64 {
  var a_4 : EmulateUint64;
  let x_92 : u32 = *(lo);
  a_4.lo = x_92;
  let x_95 : u32 = *(hi);
  a_4.hi = x_95;
  let x_97 : EmulateUint64 = a_4;
  return x_97;
}

fn make_mask_u1_(n_2 : ptr<function, u32>) -> EmulateUint64 {
  var a_5 : EmulateUint64;
  var param : u32;
  var param_1 : u32;
  param = 0u;
  param_1 = 0u;
  let x_209 : EmulateUint64 = make_emulate_uint64_u1_u1_(&(param), &(param_1));
  a_5 = x_209;
  let x_210 : u32 = *(n_2);
  let x_212 : u32 = *(n_2);
  if (((x_210 > 0u) & (x_212 < 65u))) {
    let x_218 : u32 = *(n_2);
    if ((x_218 > 32u)) {
      a_5.lo = 4294967295u;
      let x_223 : u32 = *(n_2);
      a_5.hi = (4294967295u >> (64u - x_223));
    } else {
      let x_228 : u32 = *(n_2);
      a_5.lo = (4294967295u >> (32u - x_228));
      a_5.hi = 0u;
    }
  }
  let x_233 : EmulateUint64 = a_5;
  return x_233;
}

fn bitwise_and_struct_EmulateUint64_u1_u11_struct_EmulateUint64_u1_u11_(a : EmulateUint64, b : EmulateUint64) -> EmulateUint64 {
  var c : EmulateUint64;
  c.lo = (a.lo & b.lo);
  c.hi = (a.hi & b.hi);
  let x_109 : EmulateUint64 = c;
  return x_109;
}

fn shift_left_struct_EmulateUint64_u1_u11_u1_(a_2 : EmulateUint64, n : ptr<function, u32>) -> EmulateUint64 {
  var carry : u32;
  var b_2 : EmulateUint64;
  let x_124 : u32 = *(n);
  if ((x_124 == 0u)) {
    return a_2;
  }
  let x_131 : u32 = *(n);
  if ((x_131 < 32u)) {
    let x_139 : u32 = *(n);
    carry = (a_2.lo & (4294967295u << (32u - x_139)));
    let x_145 : u32 = *(n);
    b_2.lo = (a_2.lo << x_145);
    let x_149 : u32 = *(n);
    let x_151 : u32 = carry;
    let x_152 : u32 = *(n);
    b_2.hi = ((a_2.hi << x_149) | (x_151 >> (32u - x_152)));
  } else {
    b_2.lo = 0u;
    let x_160 : u32 = *(n);
    b_2.hi = (a_2.lo << (x_160 - 32u));
  }
  let x_164 : EmulateUint64 = b_2;
  return x_164;
}

fn bitwise_or_struct_EmulateUint64_u1_u11_struct_EmulateUint64_u1_u11_(a_1 : EmulateUint64, b_1 : EmulateUint64) -> EmulateUint64 {
  var c_1 : EmulateUint64;
  c_1.lo = (a_1.lo | b_1.lo);
  c_1.hi = (a_1.hi | b_1.hi);
  let x_121 : EmulateUint64 = c_1;
  return x_121;
}

fn read_bits_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_u1_(reader_2 : ptr<function, BlockReader>, n_bits : u32) -> EmulateUint64 {
  var rem_bits : u32;
  var first_read : u32;
  var mask : EmulateUint64;
  var param_5 : u32;
  var bits : EmulateUint64;
  var param_6 : u32;
  var next_read : u32;
  var param_7 : BlockReader;
  var param_8 : u32;
  var param_9 : u32;
  var param_10 : u32;
  let x_331 : u32 = (*(reader_2)).current_bit;
  rem_bits = (64u - x_331);
  let x_334 : u32 = rem_bits;
  first_read = min(x_334, n_bits);
  let x_338 : u32 = first_read;
  param_5 = x_338;
  let x_339 : EmulateUint64 = make_mask_u1_(&(param_5));
  mask = x_339;
  let x_342 : EmulateUint64 = (*(reader_2)).word_buffer;
  let x_343 : EmulateUint64 = mask;
  let x_344 : EmulateUint64 = bitwise_and_struct_EmulateUint64_u1_u11_struct_EmulateUint64_u1_u11_(x_342, x_343);
  bits = x_344;
  let x_346 : EmulateUint64 = (*(reader_2)).word_buffer;
  param_6 = n_bits;
  let x_348 : EmulateUint64 = shift_right_struct_EmulateUint64_u1_u11_u1_(x_346, &(param_6));
  (*(reader_2)).word_buffer = x_348;
  let x_350 : u32 = first_read;
  let x_352 : u32 = (*(reader_2)).current_bit;
  (*(reader_2)).current_bit = (x_352 + x_350);
  next_read = 0u;
  let x_356 : u32 = rem_bits;
  if ((n_bits >= x_356)) {
    let x_361 : BlockReader = *(reader_2);
    param_7 = x_361;
    advance_word_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_(&(param_7));
    let x_363 : BlockReader = param_7;
    *(reader_2) = x_363;
    let x_364 : u32 = first_read;
    next_read = (n_bits - x_364);
  }
  let x_367 : u32 = next_read;
  param_8 = x_367;
  let x_368 : EmulateUint64 = make_mask_u1_(&(param_8));
  mask = x_368;
  let x_369 : EmulateUint64 = bits;
  let x_371 : EmulateUint64 = (*(reader_2)).word_buffer;
  let x_372 : EmulateUint64 = mask;
  let x_373 : EmulateUint64 = bitwise_and_struct_EmulateUint64_u1_u11_struct_EmulateUint64_u1_u11_(x_371, x_372);
  let x_375 : u32 = first_read;
  param_9 = x_375;
  let x_376 : EmulateUint64 = shift_left_struct_EmulateUint64_u1_u11_u1_(x_373, &(param_9));
  let x_377 : EmulateUint64 = bitwise_or_struct_EmulateUint64_u1_u11_struct_EmulateUint64_u1_u11_(x_369, x_376);
  bits = x_377;
  let x_379 : EmulateUint64 = (*(reader_2)).word_buffer;
  let x_381 : u32 = next_read;
  param_10 = x_381;
  let x_382 : EmulateUint64 = shift_right_struct_EmulateUint64_u1_u11_u1_(x_379, &(param_10));
  (*(reader_2)).word_buffer = x_382;
  let x_384 : u32 = next_read;
  let x_386 : u32 = (*(reader_2)).current_bit;
  (*(reader_2)).current_bit = (x_386 + x_384);
  let x_389 : EmulateUint64 = bits;
  return x_389;
}

fn decode_ints_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_u1_u1_64__(reader_3 : ptr<function, BlockReader>, block_max_bits : u32, block_1 : ptr<function, array<u32, 64u>>) {
  var i : u32;
  var x_1 : EmulateUint64;
  var param_11 : u32;
  var param_12 : u32;
  var one : EmulateUint64;
  var param_13 : u32;
  var param_14 : u32;
  var bits_1 : u32;
  var k : u32;
  var n_3 : u32;
  var m : u32;
  var param_15 : BlockReader;
  var param_16 : BlockReader;
  var param_17 : BlockReader;
  var param_18 : u32;
  var i_1 : u32;
  var param_19 : u32;
  i = 0u;
  loop {
    let x_405 : u32 = i;
    if ((x_405 < 64u)) {
    } else {
      break;
    }
    let x_407 : u32 = i;
    (*(block_1))[x_407] = 0u;

    continuing {
      let x_409 : u32 = i;
      i = (x_409 + bitcast<u32>(1i));
    }
  }
  param_11 = 0u;
  param_12 = 0u;
  let x_414 : EmulateUint64 = make_emulate_uint64_u1_u1_(&(param_11), &(param_12));
  x_1 = x_414;
  param_13 = 0u;
  param_14 = 1u;
  let x_418 : EmulateUint64 = make_emulate_uint64_u1_u1_(&(param_13), &(param_14));
  one = x_418;
  bits_1 = block_max_bits;
  k = 32u;
  n_3 = 0u;
  loop {
    var x_433 : bool;
    var x_434 : bool;
    let x_427 : u32 = bits_1;
    let x_428 : bool = (x_427 != 0u);
    x_434 = x_428;
    if (x_428) {
      let x_431 : u32 = k;
      k = (x_431 - bitcast<u32>(1i));
      x_433 = (x_431 > 0u);
      x_434 = x_433;
    }
    if (x_434) {
    } else {
      break;
    }
    let x_436 : u32 = n_3;
    let x_437 : u32 = bits_1;
    m = min(x_436, x_437);
    let x_439 : u32 = m;
    let x_440 : u32 = bits_1;
    bits_1 = (x_440 - x_439);
    let x_442 : u32 = m;
    let x_444 : BlockReader = *(reader_3);
    param_15 = x_444;
    let x_445 : EmulateUint64 = read_bits_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_u1_(&(param_15), x_442);
    let x_446 : BlockReader = param_15;
    *(reader_3) = x_446;
    x_1 = x_445;
    loop {
      var x_465 : bool;
      var x_466 : bool;
      let x_452 : u32 = n_3;
      let x_454 : u32 = bits_1;
      let x_456 : bool = ((x_452 < 64u) & (x_454 != 0u));
      x_466 = x_456;
      if (x_456) {
        let x_459 : u32 = bits_1;
        bits_1 = (x_459 - bitcast<u32>(1i));
        let x_462 : BlockReader = *(reader_3);
        param_16 = x_462;
        let x_463 : u32 = read_bit_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_(&(param_16));
        let x_464 : BlockReader = param_16;
        *(reader_3) = x_464;
        x_465 = (x_463 != 0u);
        x_466 = x_465;
      }
      if (x_466) {
      } else {
        break;
      }
      loop {
        var x_486 : bool;
        var x_487 : bool;
        let x_472 : u32 = n_3;
        let x_475 : u32 = bits_1;
        let x_477 : bool = ((x_472 < 63u) & (x_475 != 0u));
        x_487 = x_477;
        if (x_477) {
          let x_480 : u32 = bits_1;
          bits_1 = (x_480 - bitcast<u32>(1i));
          let x_483 : BlockReader = *(reader_3);
          param_17 = x_483;
          let x_484 : u32 = read_bit_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_(&(param_17));
          let x_485 : BlockReader = param_17;
          *(reader_3) = x_485;
          x_486 = (x_484 == 0u);
          x_487 = x_486;
        }
        if (x_487) {
        } else {
          break;
        }

        continuing {
          let x_488 : u32 = n_3;
          n_3 = (x_488 + bitcast<u32>(1i));
        }
      }

      continuing {
        let x_490 : EmulateUint64 = x_1;
        let x_491 : EmulateUint64 = one;
        let x_492 : u32 = n_3;
        n_3 = (x_492 + bitcast<u32>(1i));
        param_18 = x_492;
        let x_495 : EmulateUint64 = shift_left_struct_EmulateUint64_u1_u11_u1_(x_491, &(param_18));
        let x_496 : EmulateUint64 = bitwise_or_struct_EmulateUint64_u1_u11_struct_EmulateUint64_u1_u11_(x_490, x_495);
        x_1 = x_496;
      }
    }
    i_1 = 0u;
    loop {
      let x_503 : u32 = i_1;
      if ((x_503 < 64u)) {
      } else {
        break;
      }
      let x_505 : u32 = i_1;
      let x_507 : u32 = x_1.lo;
      let x_509 : u32 = k;
      let x_512 : u32 = (*(block_1))[x_505];
      (*(block_1))[x_505] = (x_512 + ((x_507 & 1u) << x_509));

      continuing {
        let x_515 : u32 = i_1;
        i_1 = (x_515 + bitcast<u32>(1i));
        let x_517 : EmulateUint64 = x_1;
        param_19 = 1u;
        let x_519 : EmulateUint64 = shift_right_struct_EmulateUint64_u1_u11_u1_(x_517, &(param_19));
        x_1 = x_519;
      }
    }
  }
  return;
}

fn uint2int_u1_(x : ptr<function, u32>) -> i32 {
  let x_392 : u32 = *(x);
  return bitcast<i32>(((x_392 ^ 2863311530u) - 2863311530u));
}

fn inverse_lift_i1_64__u1_u1_(block_2 : ptr<function, array<i32, 64u>>, s : u32, idx : u32) {
  var i_2 : u32;
  var v : vec4<i32>;
  var i_3 : u32;
  i_2 = 0u;
  loop {
    let x_526 : u32 = i_2;
    if ((x_526 < 4u)) {
    } else {
      break;
    }
    let x_532 : u32 = i_2;
    let x_533 : u32 = i_2;
    let x_538 : i32 = (*(block_2))[(idx + (x_533 * s))];
    v[x_532] = x_538;

    continuing {
      let x_540 : u32 = i_2;
      i_2 = (x_540 + bitcast<u32>(1i));
    }
  }
  let x_544 : i32 = v.w;
  let x_547 : i32 = v.y;
  v.y = (x_547 + (x_544 >> bitcast<u32>(1i)));
  let x_551 : i32 = v.y;
  let x_554 : i32 = v.w;
  v.w = (x_554 - (x_551 >> bitcast<u32>(1i)));
  let x_558 : i32 = v.w;
  let x_560 : i32 = v.y;
  v.y = (x_560 + x_558);
  let x_564 : i32 = v.w;
  v.w = (x_564 << bitcast<u32>(1i));
  let x_568 : i32 = v.y;
  let x_570 : i32 = v.w;
  v.w = (x_570 - x_568);
  let x_574 : i32 = v.x;
  let x_577 : i32 = v.z;
  v.z = (x_577 + x_574);
  let x_581 : i32 = v.x;
  v.x = (x_581 << bitcast<u32>(1i));
  let x_585 : i32 = v.z;
  let x_587 : i32 = v.x;
  v.x = (x_587 - x_585);
  let x_591 : i32 = v.z;
  let x_593 : i32 = v.y;
  v.y = (x_593 + x_591);
  let x_597 : i32 = v.z;
  v.z = (x_597 << bitcast<u32>(1i));
  let x_601 : i32 = v.y;
  let x_603 : i32 = v.z;
  v.z = (x_603 - x_601);
  let x_607 : i32 = v.x;
  let x_609 : i32 = v.w;
  v.w = (x_609 + x_607);
  let x_613 : i32 = v.x;
  v.x = (x_613 << bitcast<u32>(1i));
  let x_617 : i32 = v.w;
  let x_619 : i32 = v.x;
  v.x = (x_619 - x_617);
  i_3 = 0u;
  loop {
    let x_628 : u32 = i_3;
    if ((x_628 < 4u)) {
    } else {
      break;
    }
    let x_630 : u32 = i_3;
    let x_633 : u32 = i_3;
    let x_635 : i32 = v[x_633];
    (*(block_2))[(idx + (x_630 * s))] = x_635;

    continuing {
      let x_637 : u32 = i_3;
      i_3 = (x_637 + bitcast<u32>(1i));
    }
  }
  return;
}

fn inverse_transform_i1_64__(block_3 : ptr<function, array<i32, 64u>>) {
  var y : u32;
  var x_2 : u32;
  var param_20 : array<i32, 64u>;
  var x_3 : u32;
  var z : u32;
  var param_21 : array<i32, 64u>;
  var z_1 : u32;
  var y_1 : u32;
  var param_22 : array<i32, 64u>;
  y = 0u;
  loop {
    let x_645 : u32 = y;
    if ((x_645 < 4u)) {
    } else {
      break;
    }
    x_2 = 0u;
    loop {
      let x_653 : u32 = x_2;
      if ((x_653 < 4u)) {
      } else {
        break;
      }
      let x_656 : u32 = x_2;
      let x_657 : u32 = y;
      let x_661 : array<i32, 64u> = *(block_3);
      param_20 = x_661;
      inverse_lift_i1_64__u1_u1_(&(param_20), 16u, (x_656 + (4u * x_657)));
      let x_663 : array<i32, 64u> = param_20;
      *(block_3) = x_663;

      continuing {
        let x_664 : u32 = x_2;
        x_2 = (x_664 + bitcast<u32>(1i));
      }
    }

    continuing {
      let x_666 : u32 = y;
      y = (x_666 + bitcast<u32>(1i));
    }
  }
  x_3 = 0u;
  loop {
    let x_674 : u32 = x_3;
    if ((x_674 < 4u)) {
    } else {
      break;
    }
    z = 0u;
    loop {
      let x_682 : u32 = z;
      if ((x_682 < 4u)) {
      } else {
        break;
      }
      let x_684 : u32 = z;
      let x_686 : u32 = x_3;
      let x_689 : array<i32, 64u> = *(block_3);
      param_21 = x_689;
      inverse_lift_i1_64__u1_u1_(&(param_21), 4u, ((16u * x_684) + x_686));
      let x_691 : array<i32, 64u> = param_21;
      *(block_3) = x_691;

      continuing {
        let x_692 : u32 = z;
        z = (x_692 + bitcast<u32>(1i));
      }
    }

    continuing {
      let x_694 : u32 = x_3;
      x_3 = (x_694 + bitcast<u32>(1i));
    }
  }
  z_1 = 0u;
  loop {
    let x_702 : u32 = z_1;
    if ((x_702 < 4u)) {
    } else {
      break;
    }
    y_1 = 0u;
    loop {
      let x_710 : u32 = y_1;
      if ((x_710 < 4u)) {
      } else {
        break;
      }
      let x_712 : u32 = y_1;
      let x_714 : u32 = z_1;
      let x_718 : array<i32, 64u> = *(block_3);
      param_22 = x_718;
      inverse_lift_i1_64__u1_u1_(&(param_22), 1u, ((4u * x_712) + (16u * x_714)));
      let x_720 : array<i32, 64u> = param_22;
      *(block_3) = x_720;

      continuing {
        let x_721 : u32 = y_1;
        y_1 = (x_721 + bitcast<u32>(1i));
      }
    }

    continuing {
      let x_723 : u32 = z_1;
      z_1 = (x_723 + bitcast<u32>(1i));
    }
  }
  return;
}

fn decompress_block_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_f1_64__(reader_4 : ptr<function, BlockReader>, decompressed_block : ptr<function, array<f32, 64u>>) {
  var s_cont : u32;
  var param_23 : BlockReader;
  var emax : i32;
  var param_24 : BlockReader;
  var block_max_bits_1 : u32;
  var uint_block : array<u32, 64u>;
  var param_25 : BlockReader;
  var param_26 : array<u32, 64u>;
  var i_4 : u32;
  var int_block : array<i32, 64u>;
  var indexable : array<u32, 64u>;
  var param_27 : u32;
  var param_28 : array<i32, 64u>;
  var inv_w : f32;
  var i_5 : u32;
  let x_727 : BlockReader = *(reader_4);
  param_23 = x_727;
  let x_728 : u32 = read_bit_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_(&(param_23));
  let x_729 : BlockReader = param_23;
  *(reader_4) = x_729;
  s_cont = x_728;
  let x_730 : u32 = s_cont;
  if ((x_730 != 0u)) {
    let x_737 : BlockReader = *(reader_4);
    param_24 = x_737;
    let x_738 : EmulateUint64 = read_bits_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_u1_(&(param_24), 8u);
    let x_739 : BlockReader = param_24;
    *(reader_4) = x_739;
    emax = bitcast<i32>((x_738.lo - 127u));
    let x_746 : u32 = x_240.max_bits;
    block_max_bits_1 = (x_746 - 9u);
    let x_749 : u32 = block_max_bits_1;
    let x_752 : BlockReader = *(reader_4);
    param_25 = x_752;
    let x_754 : array<u32, 64u> = uint_block;
    param_26 = x_754;
    decode_ints_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_u1_u1_64__(&(param_25), x_749, &(param_26));
    let x_756 : BlockReader = param_25;
    *(reader_4) = x_756;
    let x_757 : array<u32, 64u> = param_26;
    uint_block = x_757;
    i_4 = 0u;
    loop {
      let x_764 : u32 = i_4;
      if ((x_764 < 64u)) {
      } else {
        break;
      }
      let x_822 : u32 = i_4;
      indexable = array<u32, 64u>(0u, 1u, 4u, 16u, 20u, 17u, 5u, 2u, 8u, 32u, 21u, 6u, 18u, 24u, 9u, 33u, 36u, 3u, 12u, 48u, 22u, 25u, 37u, 40u, 34u, 10u, 7u, 19u, 28u, 13u, 49u, 52u, 41u, 38u, 26u, 23u, 29u, 53u, 11u, 35u, 44u, 14u, 50u, 56u, 42u, 27u, 39u, 45u, 30u, 54u, 57u, 60u, 51u, 15u, 43u, 46u, 58u, 61u, 55u, 31u, 62u, 59u, 47u, 63u);
      let x_825 : u32 = indexable[x_822];
      let x_826 : u32 = i_4;
      let x_829 : u32 = uint_block[x_826];
      param_27 = x_829;
      let x_830 : i32 = uint2int_u1_(&(param_27));
      int_block[x_825] = x_830;

      continuing {
        let x_832 : u32 = i_4;
        i_4 = (x_832 + bitcast<u32>(1i));
      }
    }
    let x_835 : array<i32, 64u> = int_block;
    param_28 = x_835;
    inverse_transform_i1_64__(&(param_28));
    let x_837 : array<i32, 64u> = param_28;
    int_block = x_837;
    let x_841 : i32 = emax;
    inv_w = ldexp(1.0f, (x_841 - 30i));
    i_5 = 0u;
    loop {
      let x_851 : u32 = i_5;
      if ((x_851 < 64u)) {
      } else {
        break;
      }
      let x_853 : u32 = i_5;
      let x_854 : f32 = inv_w;
      let x_855 : u32 = i_5;
      let x_857 : i32 = int_block[x_855];
      (*(decompressed_block))[x_853] = (x_854 * f32(x_857));

      continuing {
        let x_861 : u32 = i_5;
        i_5 = (x_861 + bitcast<u32>(1i));
      }
    }
  }
  return;
}

fn main_1() {
  var block_index_1 : u32;
  var cache_location : u32;
  var reader_6 : BlockReader;
  var param_29 : u32;
  var decompressed_block_1 : array<f32, 64u>;
  var param_30 : BlockReader;
  var param_31 : array<f32, 64u>;
  var i_6 : u32;
  let x_867 : u32 = x_865.start_block_offset;
  let x_873 : u32 = gl_GlobalInvocationID.x;
  let x_876 : u32 = x_865.total_n_blocks;
  if (((x_867 + x_873) >= x_876)) {
    return;
  }
  let x_887 : u32 = x_865.start_block_offset;
  let x_889 : u32 = gl_GlobalInvocationID.x;
  let x_892 : u32 = x_885.block_ids[(x_887 + x_889)];
  block_index_1 = x_892;
  let x_898 : u32 = block_index_1;
  let x_900 : u32 = x_897.cached_item_slots[x_898];
  cache_location = x_900;
  let x_903 : u32 = block_index_1;
  param_29 = x_903;
  let x_904 : BlockReader = create_block_reader_u1_(&(param_29));
  reader_6 = x_904;
  let x_907 : BlockReader = reader_6;
  param_30 = x_907;
  let x_909 : array<f32, 64u> = decompressed_block_1;
  param_31 = x_909;
  decompress_block_struct_BlockReader_u1_u1_struct_EmulateUint64_u1_u111_f1_64__(&(param_30), &(param_31));
  let x_911 : array<f32, 64u> = param_31;
  decompressed_block_1 = x_911;
  i_6 = 0u;
  loop {
    let x_918 : u32 = i_6;
    if ((x_918 < 64u)) {
    } else {
      break;
    }
    let x_924 : u32 = cache_location;
    let x_926 : u32 = i_6;
    let x_928 : u32 = i_6;
    let x_930 : f32 = decompressed_block_1[x_928];
    x_923.decompressed[((x_924 * 64u) + x_926)] = x_930;

    continuing {
      let x_933 : u32 = i_6;
      i_6 = (x_933 + bitcast<u32>(1i));
    }
  }
  return;
}

@compute @workgroup_size(64i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const lru_cache_init_comp_spv = `struct Slot {
  age : u32,
  available : u32,
  item_id : i32,
}

alias RTArr = array<Slot>;

struct SlotData {
  slot_data : RTArr,
}

struct OldSize {
  old_size : u32,
}

alias RTArr_1 = array<i32>;

struct CachedItemSlots {
  cached_item_slot : RTArr_1,
}

alias RTArr_2 = array<u32>;

struct SlotAvailableIDs {
  slot_available_id : RTArr_2,
}

@group(0) @binding(2) var<storage, read_write> x_12 : SlotData;

@group(1) @binding(0) var<uniform> x_16 : OldSize;

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(0) var<storage, read_write> x_50 : CachedItemSlots;

@group(0) @binding(1) var<storage, read_write> x_54 : SlotAvailableIDs;

fn main_1() {
  let x_19 : u32 = x_16.old_size;
  let x_26 : u32 = gl_GlobalInvocationID.x;
  x_12.slot_data[(x_19 + x_26)].age = 100000u;
  let x_31 : u32 = x_16.old_size;
  let x_33 : u32 = gl_GlobalInvocationID.x;
  x_12.slot_data[(x_31 + x_33)].available = 1u;
  let x_39 : u32 = x_16.old_size;
  let x_41 : u32 = gl_GlobalInvocationID.x;
  x_12.slot_data[(x_39 + x_41)].item_id = -1i;
  return;
}

@compute @workgroup_size(64i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const lru_cache_mark_new_items_comp_spv = `struct PushConstants {
  global_idx_offset : u32,
  num_work_items : u32,
}

alias RTArr = array<i32>;

struct CachedItemSlots {
  cached_item_slot : RTArr,
}

alias RTArr_1 = array<u32>;

alias RTArr_2 = array<u32>;

struct ItemNeedsCaching {
  item_needs_caching : RTArr_2,
}

alias RTArr_3 = array<u32>;

struct ItemNeeded {
  item_needed : RTArr_2,
}

struct Slot {
  age : u32,
  available : u32,
  item_id : i32,
}

alias RTArr_4 = array<Slot>;

struct SlotData {
  slot_data : RTArr_4,
}

struct SlotAvailableIDs {
  slot_available_id : RTArr_2,
}

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(2) @binding(0) var<uniform> x_18 : PushConstants;

@group(0) @binding(0) var<storage, read_write> x_32 : CachedItemSlots;

@group(1) @binding(1) var<storage, read_write> x_45 : ItemNeedsCaching;

@group(1) @binding(0) var<storage, read> x_51 : ItemNeeded;

@group(0) @binding(2) var<storage, read_write> x_63 : SlotData;

@group(0) @binding(1) var<storage, read_write> x_81 : SlotAvailableIDs;

fn main_1() {
  var idx : u32;
  var slot : i32;
  let x_15 : u32 = gl_GlobalInvocationID.x;
  let x_23 : u32 = x_18.global_idx_offset;
  idx = (x_15 + (x_23 * 32u));
  let x_33 : u32 = idx;
  let x_36 : i32 = x_32.cached_item_slot[x_33];
  slot = x_36;
  let x_37 : i32 = slot;
  if ((x_37 >= 0i)) {
    let x_46 : u32 = idx;
    x_45.item_needs_caching[x_46] = 0u;
    let x_52 : u32 = idx;
    let x_54 : u32 = x_51.item_needed[x_52];
    if ((x_54 == 1u)) {
      let x_64 : i32 = slot;
      x_63.slot_data[x_64].age = 0u;
      let x_66 : i32 = slot;
      x_63.slot_data[x_66].available = 0u;
    } else {
      let x_70 : i32 = slot;
      x_63.slot_data[x_70].available = 1u;
    }
  } else {
    let x_73 : u32 = idx;
    let x_74 : u32 = idx;
    let x_76 : u32 = x_51.item_needed[x_74];
    x_45.item_needs_caching[x_73] = x_76;
  }
  return;
}

@compute @workgroup_size(32i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const lru_cache_update_comp_spv = `struct NumNewItemIDs {
  num_new_items : u32,
}

alias RTArr = array<u32>;

alias RTArr_1 = array<u32>;

struct NewItemIDs {
  new_items : RTArr_1,
}

struct SlotAvailableIDs {
  slot_available_id : RTArr_1,
}

struct Slot {
  age : u32,
  available : u32,
  item_id : i32,
}

alias RTArr_2 = array<Slot>;

struct SlotData {
  slot_data : RTArr_2,
}

alias RTArr_3 = array<i32>;

struct CachedItemSlots {
  cached_item_slot : RTArr_3,
}

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(2) @binding(0) var<uniform> x_16 : NumNewItemIDs;

@group(1) @binding(0) var<storage, read_write> x_32 : NewItemIDs;

@group(0) @binding(1) var<storage, read_write> x_41 : SlotAvailableIDs;

@group(0) @binding(2) var<storage, read_write> x_52 : SlotData;

@group(0) @binding(0) var<storage, read_write> x_66 : CachedItemSlots;

fn main_1() {
  var item : u32;
  var slot : u32;
  var prev : i32;
  let x_13 : u32 = gl_GlobalInvocationID.x;
  let x_21 : u32 = x_16.num_new_items;
  if ((x_13 >= x_21)) {
    return;
  }
  let x_34 : u32 = gl_GlobalInvocationID.x;
  let x_36 : u32 = x_32.new_items[x_34];
  item = x_36;
  let x_43 : u32 = gl_GlobalInvocationID.x;
  let x_45 : u32 = x_41.slot_available_id[x_43];
  slot = x_45;
  let x_53 : u32 = slot;
  let x_57 : i32 = x_52.slot_data[x_53].item_id;
  prev = x_57;
  let x_58 : i32 = prev;
  if ((x_58 != -1i)) {
    let x_67 : i32 = prev;
    x_66.cached_item_slot[x_67] = -1i;
  }
  let x_69 : u32 = slot;
  x_52.slot_data[x_69].age = 0u;
  let x_71 : u32 = slot;
  let x_72 : u32 = item;
  x_52.slot_data[x_71].item_id = bitcast<i32>(x_72);
  let x_75 : u32 = slot;
  x_52.slot_data[x_75].available = 0u;
  let x_78 : u32 = item;
  let x_79 : u32 = slot;
  x_66.cached_item_slot[x_78] = bitcast<i32>(x_79);
  return;
}

@compute @workgroup_size(64i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const lru_copy_available_slot_age_comp_spv = `struct NumNewItemIDs {
  num_slots_available : u32,
}

alias RTArr = array<u32>;

alias RTArr_1 = array<u32>;

struct AvailableSlotAges {
  available_slot_ages : RTArr_1,
}

struct Slot {
  age : u32,
  available : u32,
  item_id : i32,
}

alias RTArr_2 = array<Slot>;

struct SlotData {
  slot_data : RTArr_2,
}

struct SlotAvailableIDs {
  slot_available_id : RTArr_1,
}

alias RTArr_3 = array<i32>;

struct CachedItemSlots {
  cached_item_slot : RTArr_3,
}

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(2) @binding(0) var<uniform> x_16 : NumNewItemIDs;

@group(1) @binding(0) var<storage, read_write> x_30 : AvailableSlotAges;

@group(0) @binding(2) var<storage, read_write> x_37 : SlotData;

@group(0) @binding(1) var<storage, read_write> x_41 : SlotAvailableIDs;

@group(0) @binding(0) var<storage, read_write> x_52 : CachedItemSlots;

fn main_1() {
  let x_13 : u32 = gl_GlobalInvocationID.x;
  let x_21 : u32 = x_16.num_slots_available;
  if ((x_13 >= x_21)) {
    return;
  }
  let x_32 : u32 = gl_GlobalInvocationID.x;
  let x_43 : u32 = gl_GlobalInvocationID.x;
  let x_45 : u32 = x_41.slot_available_id[x_43];
  let x_47 : u32 = x_37.slot_data[x_45].age;
  x_30.available_slot_ages[x_32] = x_47;
  return;
}

@compute @workgroup_size(64i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const lru_cache_age_slots_comp_spv = `struct Slot {
  age : u32,
  available : u32,
  item_id : i32,
}

alias RTArr = array<Slot>;

struct SlotData {
  slot_data : RTArr,
}

alias RTArr_1 = array<i32>;

struct CachedItemSlots {
  cached_item_slot : RTArr_1,
}

alias RTArr_2 = array<u32>;

struct SlotAvailableIDs {
  slot_available_id : RTArr_2,
}

@group(0) @binding(2) var<storage, read_write> x_12 : SlotData;

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(0) var<storage, read_write> x_30 : CachedItemSlots;

@group(0) @binding(1) var<storage, read_write> x_34 : SlotAvailableIDs;

fn main_1() {
  let x_20 : u32 = gl_GlobalInvocationID.x;
  let x_24 : u32 = x_12.slot_data[x_20].age;
  x_12.slot_data[x_20].age = (x_24 + 1u);
  return;
}

@compute @workgroup_size(64i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const lru_cache_extract_slot_available_comp_spv = `alias RTArr = array<u32>;

alias RTArr_1 = array<u32>;

struct Output {
  out_buf : RTArr_1,
}

struct Slot {
  age : u32,
  available : u32,
  item_id : i32,
}

alias RTArr_2 = array<Slot>;

struct SlotData {
  slot_data : RTArr_2,
}

alias RTArr_3 = array<i32>;

struct CachedItemSlots {
  cached_item_slot : RTArr_3,
}

struct SlotAvailableIDs {
  slot_available_id : RTArr_1,
}

@group(1) @binding(0) var<storage, read_write> x_10 : Output;

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(2) var<storage, read_write> x_24 : SlotData;

@group(0) @binding(0) var<storage, read_write> x_35 : CachedItemSlots;

@group(0) @binding(1) var<storage, read_write> x_39 : SlotAvailableIDs;

fn main_1() {
  let x_19 : u32 = gl_GlobalInvocationID.x;
  let x_26 : u32 = gl_GlobalInvocationID.x;
  let x_30 : u32 = x_24.slot_data[x_26].available;
  x_10.out_buf[x_19] = x_30;
  return;
}

@compute @workgroup_size(64i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const macro_traverse_comp_spv = `struct GridIterator {
  grid_dims : vec3<i32>,
  grid_step : vec3<i32>,
  t_delta : vec3<f32>,
  cell : vec3<i32>,
  t_max : vec3<f32>,
  t : f32,
}

struct GridIteratorState {
  t_max : vec3<f32>,
  cell_id : i32,
}

struct VolumeParams {
  volume_dims : vec4<u32>,
  padded_dims : vec4<u32>,
  volume_scale : vec4<f32>,
  max_bits : u32,
  isovalue : f32,
  image_width : u32,
}

struct RayInfo {
  ray_dir : vec3<f32>,
  t : f32,
}

alias RTArr = array<RayInfo>;

struct RayInformation {
  rays : RTArr,
}

struct ViewParams {
  proj_view : mat4x4<f32>,
  eye_pos : vec4<f32>,
  eye_dir : vec4<f32>,
  near_plane : f32,
  current_pass_index : u32,
  speculation_count : u32,
}

alias RTArr_1 = array<u32>;

alias RTArr_2 = array<u32>;

struct RayIDs {
  ray_ids : RTArr_2,
}

alias RTArr_3 = array<u32>;

struct RayOffsets {
  ray_offsets : RTArr_2,
}

struct GridIteratorState_1 {
  t_max : vec3<f32>,
  cell_id : i32,
}

alias RTArr_4 = array<GridIteratorState_1>;

struct GridIterState {
  iterator_state : RTArr_4,
}

alias RTArr_5 = array<vec2<f32>>;

alias RTArr_6 = array<vec2<f32>>;

struct CoarseCellRange {
  coarse_cell_ranges : RTArr_6,
}

struct VoxelInformation {
  voxel_ranges : RTArr_6,
}

struct RayBlockIDs {
  block_ids : RTArr_2,
}

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(0) var<uniform> x_312 : VolumeParams;

@group(0) @binding(2) var<storage, read_write> x_334 : RayInformation;

@group(0) @binding(1) var<uniform> x_347 : ViewParams;

@group(0) @binding(5) var<storage, read_write> x_367 : RayIDs;

@group(0) @binding(6) var<storage, read_write> x_371 : RayOffsets;

@group(0) @binding(4) var<storage, read_write> x_479 : GridIterState;

@group(1) @binding(1) var<storage, read_write> x_533 : CoarseCellRange;

@group(1) @binding(0) var<storage, read_write> x_667 : VoxelInformation;

@group(0) @binding(7) var<storage, read_write> x_695 : RayBlockIDs;

@group(0) @binding(3) var render_target : texture_storage_2d<rgba8unorm, write>;

fn init_grid_iterator_vf3_vf3_f1_vi3_(ray_org : ptr<function, vec3<f32>>, ray_dir : ptr<function, vec3<f32>>, t : ptr<function, f32>, grid_dims_1 : ptr<function, vec3<i32>>) -> GridIterator {
  var grid_iter : GridIterator;
  var inv_ray_dir : vec3<f32>;
  var p_1 : vec3<f32>;
  var cell : vec3<f32>;
  var t_max_neg : vec3<f32>;
  var t_max_pos : vec3<f32>;
  var is_neg_dir : vec3<bool>;
  let x_67 : vec3<i32> = *(grid_dims_1);
  grid_iter.grid_dims = x_67;
  let x_70 : vec3<f32> = *(ray_dir);
  grid_iter.grid_step = vec3<i32>(sign(x_70));
  let x_76 : vec3<f32> = *(ray_dir);
  inv_ray_dir = (vec3<f32>(1.0f, 1.0f, 1.0f) / x_76);
  let x_80 : vec3<f32> = inv_ray_dir;
  grid_iter.t_delta = abs(x_80);
  let x_84 : vec3<f32> = *(ray_org);
  let x_85 : f32 = *(t);
  let x_86 : vec3<f32> = *(ray_dir);
  p_1 = (x_84 + (x_86 * x_85));
  let x_89 : vec3<f32> = p_1;
  let x_92 : vec3<i32> = *(grid_dims_1);
  p_1 = clamp(x_89, vec3<f32>(0.0f, 0.0f, 0.0f), vec3<f32>((x_92 - vec3<i32>(1i, 1i, 1i))));
  let x_98 : vec3<f32> = p_1;
  cell = floor(x_98);
  let x_101 : vec3<f32> = cell;
  let x_102 : vec3<f32> = *(ray_org);
  let x_104 : vec3<f32> = inv_ray_dir;
  t_max_neg = ((x_101 - x_102) * x_104);
  let x_107 : vec3<f32> = cell;
  let x_110 : vec3<f32> = *(ray_org);
  let x_112 : vec3<f32> = inv_ray_dir;
  t_max_pos = (((x_107 + vec3<f32>(1.0f, 1.0f, 1.0f)) - x_110) * x_112);
  let x_116 : vec3<f32> = *(ray_dir);
  is_neg_dir = (x_116 < vec3<f32>(0.0f, 0.0f, 0.0f));
  let x_119 : vec3<f32> = t_max_pos;
  let x_120 : vec3<f32> = t_max_neg;
  let x_121 : vec3<bool> = is_neg_dir;
  grid_iter.t_max = select(x_119, x_120, x_121);
  let x_125 : vec3<f32> = cell;
  grid_iter.cell = vec3<i32>(x_125);
  let x_129 : f32 = *(t);
  grid_iter.t = x_129;
  let x_131 : GridIterator = grid_iter;
  return x_131;
}

fn restore_grid_iterator_vf3_vf3_vi3_struct_GridIteratorState_vf3_i11_(ray_org_1 : ptr<function, vec3<f32>>, ray_dir_1 : ptr<function, vec3<f32>>, grid_dims_2 : ptr<function, vec3<i32>>, state : ptr<function, GridIteratorState>) -> GridIterator {
  var grid_iter_1 : GridIterator;
  var inv_ray_dir_1 : vec3<f32>;
  let x_135 : vec3<i32> = *(grid_dims_2);
  grid_iter_1.grid_dims = x_135;
  let x_137 : vec3<f32> = *(ray_dir_1);
  grid_iter_1.grid_step = vec3<i32>(sign(x_137));
  let x_142 : vec3<f32> = *(ray_dir_1);
  inv_ray_dir_1 = (vec3<f32>(1.0f, 1.0f, 1.0f) / x_142);
  let x_145 : vec3<f32> = inv_ray_dir_1;
  grid_iter_1.t_delta = abs(x_145);
  let x_150 : i32 = (*(state)).cell_id;
  let x_154 : i32 = (*(grid_dims_2)).x;
  let x_157 : i32 = (*(state)).cell_id;
  let x_159 : i32 = (*(grid_dims_2)).x;
  let x_163 : i32 = (*(grid_dims_2)).y;
  let x_166 : i32 = (*(state)).cell_id;
  let x_168 : i32 = (*(grid_dims_2)).x;
  let x_170 : i32 = (*(grid_dims_2)).y;
  grid_iter_1.cell = vec3<i32>((x_150 % x_154), ((x_157 / x_159) % x_163), (x_166 / (x_168 * x_170)));
  let x_176 : vec3<f32> = (*(state)).t_max;
  grid_iter_1.t_max = x_176;
  let x_179 : f32 = (*(state)).t_max.x;
  let x_181 : f32 = (*(state)).t_max.y;
  let x_184 : f32 = (*(state)).t_max.z;
  grid_iter_1.t = min(x_179, min(x_181, x_184));
  let x_188 : GridIterator = grid_iter_1;
  return x_188;
}

fn outside_grid_vi3_vi3_(p : vec3<i32>, grid_dims : vec3<i32>) -> bool {
  var x_62 : bool;
  var x_63 : bool;
  let x_57 : bool = any((p < vec3<i32>(0i, 0i, 0i)));
  x_63 = x_57;
  if (!(x_57)) {
    x_62 = any((p >= grid_dims));
    x_63 = x_62;
  }
  return x_63;
}

fn grid_iterator_get_cell_struct_GridIterator_vi3_vi3_vf3_vi3_vf3_f11_vf2_vi3_(iter : ptr<function, GridIterator>, cell_t_range : ptr<function, vec2<f32>>, cell_id : ptr<function, vec3<i32>>) -> bool {
  let x_192 : vec3<i32> = (*(iter)).cell;
  let x_194 : vec3<i32> = (*(iter)).grid_dims;
  let x_195 : bool = outside_grid_vi3_vi3_(x_192, x_194);
  if (x_195) {
    return false;
  }
  let x_201 : f32 = (*(iter)).t;
  (*(cell_t_range)).x = x_201;
  let x_204 : f32 = (*(iter)).t_max.x;
  let x_206 : f32 = (*(iter)).t_max.y;
  let x_208 : f32 = (*(iter)).t_max.z;
  (*(cell_t_range)).y = min(x_204, min(x_206, x_208));
  let x_213 : vec3<i32> = (*(iter)).cell;
  *(cell_id) = x_213;
  let x_215 : f32 = (*(cell_t_range)).y;
  let x_217 : f32 = (*(cell_t_range)).x;
  if ((x_215 < x_217)) {
    return false;
  }
  return true;
}

fn grid_iterator_advance_struct_GridIterator_vi3_vi3_vf3_vi3_vf3_f11_(iter_2 : ptr<function, GridIterator>) {
  let x_242 : f32 = (*(iter_2)).t_max.x;
  let x_244 : f32 = (*(iter_2)).t_max.y;
  let x_246 : f32 = (*(iter_2)).t_max.z;
  (*(iter_2)).t = min(x_242, min(x_244, x_246));
  let x_251 : f32 = (*(iter_2)).t;
  let x_253 : f32 = (*(iter_2)).t_max.x;
  if ((x_251 == x_253)) {
    let x_258 : i32 = (*(iter_2)).grid_step.x;
    let x_260 : i32 = (*(iter_2)).cell.x;
    (*(iter_2)).cell.x = (x_260 + x_258);
    let x_264 : f32 = (*(iter_2)).t_delta.x;
    let x_266 : f32 = (*(iter_2)).t_max.x;
    (*(iter_2)).t_max.x = (x_266 + x_264);
  } else {
    let x_271 : f32 = (*(iter_2)).t;
    let x_273 : f32 = (*(iter_2)).t_max.y;
    if ((x_271 == x_273)) {
      let x_278 : i32 = (*(iter_2)).grid_step.y;
      let x_280 : i32 = (*(iter_2)).cell.y;
      (*(iter_2)).cell.y = (x_280 + x_278);
      let x_284 : f32 = (*(iter_2)).t_delta.y;
      let x_286 : f32 = (*(iter_2)).t_max.y;
      (*(iter_2)).t_max.y = (x_286 + x_284);
    } else {
      let x_291 : i32 = (*(iter_2)).grid_step.z;
      let x_293 : i32 = (*(iter_2)).cell.z;
      (*(iter_2)).cell.z = (x_293 + x_291);
      let x_297 : f32 = (*(iter_2)).t_delta.z;
      let x_299 : f32 = (*(iter_2)).t_max.z;
      (*(iter_2)).t_max.z = (x_299 + x_297);
    }
  }
  return;
}

fn grid_iterator_get_cell_id_struct_GridIterator_vi3_vi3_vf3_vi3_vf3_f11_(iter_1 : ptr<function, GridIterator>) -> i32 {
  let x_226 : i32 = (*(iter_1)).cell.x;
  let x_228 : i32 = (*(iter_1)).grid_dims.x;
  let x_230 : i32 = (*(iter_1)).cell.y;
  let x_232 : i32 = (*(iter_1)).grid_dims.y;
  let x_234 : i32 = (*(iter_1)).cell.z;
  return (x_226 + (x_228 * (x_230 + (x_232 * x_234))));
}

fn main_1() {
  var ray_index : u32;
  var i : i32;
  var n_blocks : vec3<u32>;
  var macrogrid_dims : vec3<i32>;
  var coarse_grid_dims : vec3<i32>;
  var volume_translation : vec3<f32>;
  var transformed_eye : vec3<f32>;
  var ray_org_2 : vec3<f32>;
  var macrocell_grid_org : vec3<f32>;
  var macrocell_grid_ray_dir : vec3<f32>;
  var coarse_grid_org : vec3<f32>;
  var coarse_grid_ray_dir : vec3<f32>;
  var first_coarse_iter : bool;
  var coarse_grid_iter : GridIterator;
  var param : vec3<f32>;
  var param_1 : vec3<f32>;
  var param_2 : f32;
  var param_3 : vec3<i32>;
  var param_4 : vec3<f32>;
  var param_5 : vec3<f32>;
  var param_6 : vec3<i32>;
  var param_7 : GridIteratorState;
  var speculated : u32;
  var coarse_cell_t_range : vec2<f32>;
  var coarse_cell_id : vec3<i32>;
  var param_8 : GridIterator;
  var param_9 : vec2<f32>;
  var param_10 : vec3<i32>;
  var coarse_cell_index : u32;
  var coarse_cell_range : vec2<f32>;
  var param_11 : GridIterator;
  var coarse_grid_cell_org : vec3<i32>;
  var macrocell_grid_dims : vec3<i32>;
  var grid_iter_2 : GridIterator;
  var param_12 : vec3<f32>;
  var param_13 : vec3<f32>;
  var param_14 : f32;
  var param_15 : vec3<i32>;
  var param_16 : vec3<f32>;
  var param_17 : vec3<f32>;
  var param_18 : vec3<i32>;
  var param_19 : GridIteratorState;
  var param_20 : GridIterator;
  var cell_t_range_1 : vec2<f32>;
  var cell_id_1 : vec3<i32>;
  var param_21 : GridIterator;
  var param_22 : vec2<f32>;
  var param_23 : vec3<i32>;
  var block_index : u32;
  var cell_range : vec2<f32>;
  var param_24 : GridIterator;
  var param_25 : GridIterator;
  var param_26 : GridIterator;
  var param_27 : GridIterator;
  let x_307 : u32 = gl_GlobalInvocationID.x;
  let x_315 : u32 = x_312.image_width;
  if ((x_307 >= x_315)) {
    return;
  }
  let x_323 : u32 = gl_GlobalInvocationID.x;
  let x_325 : u32 = gl_GlobalInvocationID.y;
  let x_327 : u32 = x_312.image_width;
  ray_index = (x_323 + (x_325 * x_327));
  let x_335 : u32 = ray_index;
  let x_338 : f32 = x_334.rays[x_335].t;
  if ((x_338 == 340282346638528859811704183484516925440.0f)) {
    return;
  }
  let x_349 : u32 = x_347.speculation_count;
  if ((x_349 > 1u)) {
    i = 0i;
    loop {
      let x_359 : i32 = i;
      let x_362 : u32 = x_347.speculation_count;
      if ((bitcast<u32>(x_359) < x_362)) {
      } else {
        break;
      }
      let x_372 : u32 = ray_index;
      let x_374 : u32 = x_371.ray_offsets[x_372];
      let x_376 : u32 = x_347.speculation_count;
      let x_378 : i32 = i;
      let x_381 : u32 = ray_index;
      x_367.ray_ids[((x_374 * x_376) + bitcast<u32>(x_378))] = x_381;

      continuing {
        let x_383 : i32 = i;
        i = (x_383 + 1i);
      }
    }
  } else {
    let x_386 : u32 = ray_index;
    let x_387 : u32 = ray_index;
    x_367.ray_ids[x_386] = x_387;
    let x_389 : u32 = ray_index;
    let x_390 : u32 = ray_index;
    x_371.ray_offsets[x_389] = x_390;
  }
  let x_396 : vec4<u32> = x_312.padded_dims;
  n_blocks = (vec3<u32>(x_396.x, x_396.y, x_396.z) / vec3<u32>(4u, 4u, 4u));
  let x_402 : vec3<u32> = n_blocks;
  macrogrid_dims = bitcast<vec3<i32>>(x_402);
  let x_405 : vec3<i32> = macrogrid_dims;
  coarse_grid_dims = vec3<i32>(ceil((vec3<f32>(x_405) / vec3<f32>(4.0f, 4.0f, 4.0f))));
  let x_415 : vec4<f32> = x_312.volume_scale;
  volume_translation = (vec3<f32>(0.0f, 0.0f, 0.0f) - (vec3<f32>(x_415.x, x_415.y, x_415.z) * 0.5f));
  let x_422 : vec4<f32> = x_347.eye_pos;
  let x_424 : vec3<f32> = volume_translation;
  let x_427 : vec4<f32> = x_312.volume_scale;
  transformed_eye = ((vec3<f32>(x_422.x, x_422.y, x_422.z) - x_424) / vec3<f32>(x_427.x, x_427.y, x_427.z));
  let x_431 : vec3<f32> = transformed_eye;
  let x_433 : vec4<u32> = x_312.volume_dims;
  ray_org_2 = ((x_431 * vec3<f32>(vec3<u32>(x_433.x, x_433.y, x_433.z))) - vec3<f32>(0.5f, 0.5f, 0.5f));
  let x_440 : vec3<f32> = ray_org_2;
  macrocell_grid_org = (x_440 * 0.25f);
  let x_444 : u32 = ray_index;
  let x_447 : vec3<f32> = x_334.rays[x_444].ray_dir;
  macrocell_grid_ray_dir = (x_447 * 0.25f);
  let x_450 : vec3<f32> = macrocell_grid_org;
  coarse_grid_org = (x_450 * 0.25f);
  let x_453 : vec3<f32> = macrocell_grid_ray_dir;
  coarse_grid_ray_dir = (x_453 * 0.25f);
  first_coarse_iter = true;
  let x_458 : u32 = x_347.current_pass_index;
  if ((x_458 == 0u)) {
    let x_463 : u32 = ray_index;
    let x_465 : vec3<f32> = coarse_grid_org;
    param = x_465;
    let x_467 : vec3<f32> = coarse_grid_ray_dir;
    param_1 = x_467;
    let x_470 : f32 = x_334.rays[x_463].t;
    param_2 = x_470;
    let x_472 : vec3<i32> = coarse_grid_dims;
    param_3 = x_472;
    let x_473 : GridIterator = init_grid_iterator_vf3_vf3_f1_vi3_(&(param), &(param_1), &(param_2), &(param_3));
    coarse_grid_iter = x_473;
  } else {
    let x_480 : u32 = ray_index;
    let x_483 : vec3<f32> = coarse_grid_org;
    param_4 = x_483;
    let x_485 : vec3<f32> = coarse_grid_ray_dir;
    param_5 = x_485;
    let x_487 : vec3<i32> = coarse_grid_dims;
    param_6 = x_487;
    let x_491 : GridIteratorState_1 = x_479.iterator_state[(x_480 * 2u)];
    param_7.t_max = x_491.t_max;
    param_7.cell_id = x_491.cell_id;
    let x_496 : GridIterator = restore_grid_iterator_vf3_vf3_vi3_struct_GridIteratorState_vf3_i11_(&(param_4), &(param_5), &(param_6), &(param_7));
    coarse_grid_iter = x_496;
  }
  speculated = 0u;
  loop {
    var x_550 : bool;
    var x_551 : bool;
    let x_506 : GridIterator = coarse_grid_iter;
    param_8 = x_506;
    let x_509 : bool = grid_iterator_get_cell_struct_GridIterator_vi3_vi3_vf3_vi3_vf3_f11_vf2_vi3_(&(param_8), &(param_9), &(param_10));
    let x_510 : GridIterator = param_8;
    coarse_grid_iter = x_510;
    let x_511 : vec2<f32> = param_9;
    coarse_cell_t_range = x_511;
    let x_512 : vec3<i32> = param_10;
    coarse_cell_id = x_512;
    if (x_509) {
    } else {
      break;
    }
    let x_515 : i32 = coarse_cell_id.x;
    let x_517 : i32 = coarse_grid_dims.x;
    let x_519 : i32 = coarse_cell_id.y;
    let x_521 : i32 = coarse_grid_dims.y;
    let x_523 : i32 = coarse_cell_id.z;
    coarse_cell_index = bitcast<u32>((x_515 + (x_517 * (x_519 + (x_521 * x_523)))));
    let x_534 : u32 = coarse_cell_index;
    let x_537 : vec2<f32> = x_533.coarse_cell_ranges[x_534];
    coarse_cell_range = x_537;
    let x_539 : f32 = x_312.isovalue;
    let x_541 : f32 = coarse_cell_range.x;
    let x_542 : bool = (x_539 < x_541);
    x_551 = x_542;
    if (!(x_542)) {
      let x_547 : f32 = x_312.isovalue;
      let x_549 : f32 = coarse_cell_range.y;
      x_550 = (x_547 > x_549);
      x_551 = x_550;
    }
    if (x_551) {
      first_coarse_iter = false;
      let x_555 : GridIterator = coarse_grid_iter;
      param_11 = x_555;
      grid_iterator_advance_struct_GridIterator_vi3_vi3_vf3_vi3_vf3_f11_(&(param_11));
      let x_557 : GridIterator = param_11;
      coarse_grid_iter = x_557;
      continue;
    }
    let x_560 : vec3<i32> = coarse_cell_id;
    coarse_grid_cell_org = (x_560 * vec3<i32>(4i, 4i, 4i));
    let x_564 : vec3<i32> = coarse_grid_cell_org;
    let x_567 : vec3<i32> = macrogrid_dims;
    let x_570 : vec3<i32> = coarse_grid_cell_org;
    macrocell_grid_dims = vec3<i32>((min((vec3<f32>(x_564) + vec3<f32>(4.0f, 4.0f, 4.0f)), vec3<f32>(x_567)) - vec3<f32>(x_570)));
    let x_575 : u32 = x_347.current_pass_index;
    let x_577 : bool = first_coarse_iter;
    if (((x_575 == 0u) | !(x_577))) {
      let x_583 : vec3<f32> = macrocell_grid_org;
      let x_584 : vec3<i32> = coarse_grid_cell_org;
      param_12 = (x_583 - vec3<f32>(x_584));
      let x_589 : vec3<f32> = macrocell_grid_ray_dir;
      param_13 = x_589;
      let x_592 : f32 = coarse_cell_t_range.x;
      param_14 = x_592;
      let x_594 : vec3<i32> = macrocell_grid_dims;
      param_15 = x_594;
      let x_595 : GridIterator = init_grid_iterator_vf3_vf3_f1_vi3_(&(param_12), &(param_13), &(param_14), &(param_15));
      grid_iter_2 = x_595;
    } else {
      let x_597 : vec3<f32> = macrocell_grid_org;
      let x_598 : vec3<i32> = coarse_grid_cell_org;
      let x_601 : u32 = ray_index;
      param_16 = (x_597 - vec3<f32>(x_598));
      let x_606 : vec3<f32> = macrocell_grid_ray_dir;
      param_17 = x_606;
      let x_608 : vec3<i32> = macrocell_grid_dims;
      param_18 = x_608;
      let x_611 : GridIteratorState_1 = x_479.iterator_state[((x_601 * 2u) + 1u)];
      param_19.t_max = x_611.t_max;
      param_19.cell_id = x_611.cell_id;
      let x_616 : GridIterator = restore_grid_iterator_vf3_vf3_vi3_struct_GridIteratorState_vf3_i11_(&(param_16), &(param_17), &(param_18), &(param_19));
      grid_iter_2 = x_616;
      let x_618 : GridIterator = grid_iter_2;
      param_20 = x_618;
      grid_iterator_advance_struct_GridIterator_vi3_vi3_vf3_vi3_vf3_f11_(&(param_20));
      let x_620 : GridIterator = param_20;
      grid_iter_2 = x_620;
    }
    loop {
      var x_682 : bool;
      var x_683 : bool;
      let x_629 : GridIterator = grid_iter_2;
      param_21 = x_629;
      let x_632 : bool = grid_iterator_get_cell_struct_GridIterator_vi3_vi3_vf3_vi3_vf3_f11_vf2_vi3_(&(param_21), &(param_22), &(param_23));
      let x_633 : GridIterator = param_21;
      grid_iter_2 = x_633;
      let x_634 : vec2<f32> = param_22;
      cell_t_range_1 = x_634;
      let x_635 : vec3<i32> = param_23;
      cell_id_1 = x_635;
      if (x_632) {
      } else {
        break;
      }
      let x_638 : i32 = coarse_grid_cell_org.x;
      let x_640 : i32 = cell_id_1.x;
      let x_644 : u32 = n_blocks.x;
      let x_646 : i32 = coarse_grid_cell_org.y;
      let x_648 : i32 = cell_id_1.y;
      let x_652 : u32 = n_blocks.y;
      let x_654 : i32 = coarse_grid_cell_org.z;
      let x_656 : i32 = cell_id_1.z;
      block_index = (bitcast<u32>((x_638 + x_640)) + (x_644 * (bitcast<u32>((x_646 + x_648)) + (x_652 * bitcast<u32>((x_654 + x_656))))));
      let x_668 : u32 = block_index;
      let x_670 : vec2<f32> = x_667.voxel_ranges[x_668];
      cell_range = x_670;
      let x_672 : f32 = x_312.isovalue;
      let x_674 : f32 = cell_range.x;
      let x_675 : bool = (x_672 >= x_674);
      x_683 = x_675;
      if (x_675) {
        let x_679 : f32 = x_312.isovalue;
        let x_681 : f32 = cell_range.y;
        x_682 = (x_679 <= x_681);
        x_683 = x_682;
      }
      if (x_683) {
        let x_687 : u32 = x_347.speculation_count;
        if ((x_687 == 0u)) {
          return;
        }
        let x_696 : u32 = ray_index;
        let x_698 : u32 = x_371.ray_offsets[x_696];
        let x_700 : u32 = x_347.speculation_count;
        let x_702 : u32 = speculated;
        let x_704 : u32 = block_index;
        x_695.block_ids[((x_698 * x_700) + x_702)] = x_704;
        let x_706 : u32 = speculated;
        speculated = (x_706 + bitcast<u32>(1i));
        let x_708 : u32 = speculated;
        let x_710 : u32 = x_347.speculation_count;
        if ((x_708 == x_710)) {
          let x_714 : u32 = ray_index;
          let x_717 : GridIterator = coarse_grid_iter;
          param_24 = x_717;
          let x_718 : i32 = grid_iterator_get_cell_id_struct_GridIterator_vi3_vi3_vf3_vi3_vf3_f11_(&(param_24));
          x_479.iterator_state[(x_714 * 2u)].cell_id = x_718;
          let x_721 : u32 = ray_index;
          let x_724 : vec3<f32> = coarse_grid_iter.t_max;
          x_479.iterator_state[(x_721 * 2u)].t_max = x_724;
          let x_726 : u32 = ray_index;
          let x_730 : GridIterator = grid_iter_2;
          param_25 = x_730;
          let x_731 : i32 = grid_iterator_get_cell_id_struct_GridIterator_vi3_vi3_vf3_vi3_vf3_f11_(&(param_25));
          x_479.iterator_state[((x_726 * 2u) + 1u)].cell_id = x_731;
          let x_733 : u32 = ray_index;
          let x_737 : vec3<f32> = grid_iter_2.t_max;
          x_479.iterator_state[((x_733 * 2u) + 1u)].t_max = x_737;
          return;
        }
      }
      let x_741 : GridIterator = grid_iter_2;
      param_26 = x_741;
      grid_iterator_advance_struct_GridIterator_vi3_vi3_vf3_vi3_vf3_f11_(&(param_26));
      let x_743 : GridIterator = param_26;
      grid_iter_2 = x_743;
    }
    first_coarse_iter = false;
    let x_745 : GridIterator = coarse_grid_iter;
    param_27 = x_745;
    grid_iterator_advance_struct_GridIterator_vi3_vi3_vf3_vi3_vf3_f11_(&(param_27));
    let x_747 : GridIterator = param_27;
    coarse_grid_iter = x_747;
  }
  let x_748 : u32 = ray_index;
  x_334.rays[x_748].t = 340282346638528859811704183484516925440.0f;
  return;
}

@compute @workgroup_size(64i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const radix_sort_chunk_comp_spv = `struct BufferInfo {
  size : u32,
}

alias RTArr = array<u32>;

alias RTArr_1 = array<u32>;

struct Keys {
  keys : RTArr_1,
}

struct Values {
  values : RTArr_1,
}

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(0) var<uniform> x_16 : BufferInfo;

var<workgroup> key_buf : array<u32, 256u>;

var<private> gl_LocalInvocationID : vec3<u32>;

@group(1) @binding(0) var<storage, read_write> x_36 : Keys;

var<workgroup> val_buf : array<u32, 256u>;

@group(1) @binding(1) var<storage, read_write> x_49 : Values;

var<workgroup> scratch : array<u32, 256u>;

var<workgroup> total_false : u32;

var<workgroup> sorted_key_buf : array<u32, 256u>;

var<workgroup> sorted_val_buf : array<u32, 256u>;

fn main_1() {
  var i : u32;
  var mask : u32;
  var offs : u32;
  var d : i32;
  var a : u32;
  var b : u32;
  var d_1 : i32;
  var a_1 : u32;
  var b_1 : u32;
  var tmp : u32;
  var f : u32;
  var t : u32;
  let x_13 : u32 = gl_GlobalInvocationID.x;
  let x_21 : u32 = x_16.size;
  if ((x_13 < x_21)) {
    let x_32 : u32 = gl_LocalInvocationID.x;
    let x_38 : u32 = gl_GlobalInvocationID.x;
    let x_40 : u32 = x_36.keys[x_38];
    key_buf[x_32] = x_40;
    let x_45 : u32 = gl_LocalInvocationID.x;
    let x_51 : u32 = gl_GlobalInvocationID.x;
    let x_53 : u32 = x_49.values[x_51];
    val_buf[x_45] = x_53;
  } else {
    let x_57 : u32 = gl_LocalInvocationID.x;
    key_buf[x_57] = 4294967295u;
    let x_61 : u32 = gl_LocalInvocationID.x;
    val_buf[x_61] = 4294967295u;
  }
  i = 0u;
  loop {
    let x_70 : u32 = i;
    if ((x_70 < 32u)) {
    } else {
      break;
    }
    workgroupBarrier();
    let x_77 : u32 = i;
    mask = bitcast<u32>((1i << x_77));
    let x_82 : u32 = gl_LocalInvocationID.x;
    let x_84 : u32 = gl_LocalInvocationID.x;
    let x_86 : u32 = key_buf[x_84];
    let x_87 : u32 = mask;
    scratch[x_82] = bitcast<u32>(select(1i, 0i, ((x_86 & x_87) != 0u)));
    offs = 1u;
    d = 128i;
    loop {
      let x_103 : i32 = d;
      if ((x_103 > 0i)) {
      } else {
        break;
      }
      workgroupBarrier();
      let x_106 : u32 = gl_LocalInvocationID.x;
      let x_107 : i32 = d;
      if ((x_106 < bitcast<u32>(x_107))) {
        let x_113 : u32 = offs;
        let x_115 : u32 = gl_LocalInvocationID.x;
        a = ((x_113 * ((2u * x_115) + 1u)) - 1u);
        let x_121 : u32 = offs;
        let x_123 : u32 = gl_LocalInvocationID.x;
        b = ((x_121 * ((2u * x_123) + 2u)) - 1u);
        let x_128 : u32 = b;
        let x_129 : u32 = a;
        let x_131 : u32 = scratch[x_129];
        let x_133 : u32 = scratch[x_128];
        scratch[x_128] = (x_133 + x_131);
      }
      let x_136 : u32 = offs;
      offs = (x_136 << bitcast<u32>(1i));

      continuing {
        let x_138 : i32 = d;
        d = (x_138 >> bitcast<u32>(1i));
      }
    }
    let x_141 : u32 = gl_LocalInvocationID.x;
    if ((x_141 == 0u)) {
      let x_148 : u32 = scratch[255i];
      total_false = x_148;
      scratch[255i] = 0u;
    }
    d_1 = 1i;
    loop {
      let x_156 : i32 = d_1;
      if ((x_156 < 256i)) {
      } else {
        break;
      }
      let x_159 : u32 = offs;
      offs = (x_159 >> bitcast<u32>(1i));
      workgroupBarrier();
      let x_162 : u32 = gl_LocalInvocationID.x;
      let x_163 : i32 = d_1;
      if ((x_162 < bitcast<u32>(x_163))) {
        let x_169 : u32 = offs;
        let x_171 : u32 = gl_LocalInvocationID.x;
        a_1 = ((x_169 * ((2u * x_171) + 1u)) - 1u);
        let x_177 : u32 = offs;
        let x_179 : u32 = gl_LocalInvocationID.x;
        b_1 = ((x_177 * ((2u * x_179) + 2u)) - 1u);
        let x_185 : u32 = a_1;
        let x_187 : u32 = scratch[x_185];
        tmp = x_187;
        let x_188 : u32 = a_1;
        let x_189 : u32 = b_1;
        let x_191 : u32 = scratch[x_189];
        scratch[x_188] = x_191;
        let x_193 : u32 = b_1;
        let x_194 : u32 = tmp;
        let x_196 : u32 = scratch[x_193];
        scratch[x_193] = (x_196 + x_194);
      }

      continuing {
        let x_199 : i32 = d_1;
        d_1 = (x_199 << bitcast<u32>(1i));
      }
    }
    workgroupBarrier();
    let x_203 : u32 = gl_LocalInvocationID.x;
    let x_205 : u32 = scratch[x_203];
    f = x_205;
    let x_208 : u32 = gl_LocalInvocationID.x;
    let x_209 : u32 = f;
    let x_211 : u32 = total_false;
    t = ((x_208 - x_209) + x_211);
    let x_214 : u32 = gl_LocalInvocationID.x;
    let x_216 : u32 = key_buf[x_214];
    let x_217 : u32 = mask;
    if (((x_216 & x_217) != 0u)) {
      let x_223 : u32 = t;
      let x_225 : u32 = gl_LocalInvocationID.x;
      let x_227 : u32 = key_buf[x_225];
      sorted_key_buf[x_223] = x_227;
      let x_230 : u32 = t;
      let x_232 : u32 = gl_LocalInvocationID.x;
      let x_234 : u32 = val_buf[x_232];
      sorted_val_buf[x_230] = x_234;
    } else {
      let x_237 : u32 = f;
      let x_239 : u32 = gl_LocalInvocationID.x;
      let x_241 : u32 = key_buf[x_239];
      sorted_key_buf[x_237] = x_241;
      let x_243 : u32 = f;
      let x_245 : u32 = gl_LocalInvocationID.x;
      let x_247 : u32 = val_buf[x_245];
      sorted_val_buf[x_243] = x_247;
    }
    workgroupBarrier();
    let x_250 : u32 = gl_LocalInvocationID.x;
    let x_252 : u32 = gl_LocalInvocationID.x;
    let x_254 : u32 = sorted_key_buf[x_252];
    key_buf[x_250] = x_254;
    let x_257 : u32 = gl_LocalInvocationID.x;
    let x_259 : u32 = gl_LocalInvocationID.x;
    let x_261 : u32 = sorted_val_buf[x_259];
    val_buf[x_257] = x_261;

    continuing {
      let x_263 : u32 = i;
      i = (x_263 + bitcast<u32>(1i));
    }
  }
  workgroupBarrier();
  let x_266 : u32 = gl_GlobalInvocationID.x;
  let x_268 : u32 = gl_LocalInvocationID.x;
  let x_270 : u32 = key_buf[x_268];
  x_36.keys[x_266] = x_270;
  let x_273 : u32 = gl_GlobalInvocationID.x;
  let x_275 : u32 = gl_LocalInvocationID.x;
  let x_277 : u32 = val_buf[x_275];
  x_49.values[x_273] = x_277;
  return;
}

@compute @workgroup_size(256i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>, @builtin(local_invocation_id) gl_LocalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  gl_LocalInvocationID = gl_LocalInvocationID_param;
  main_1();
}
`;

export const reverse_buffer_comp_spv = `struct BufferInfo {
  size : u32,
}

alias RTArr = array<u32>;

struct Values {
  values : RTArr,
}

@group(0) @binding(0) var<uniform> x_48 : BufferInfo;

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(1) @binding(0) var<storage, read_write> x_94 : Values;

fn next_pow2_u1_(x : ptr<function, u32>) -> u32 {
  let x_12 : u32 = *(x);
  *(x) = (x_12 - 1u);
  let x_15 : u32 = *(x);
  let x_19 : u32 = *(x);
  *(x) = (x_19 | (x_15 >> bitcast<u32>(1i)));
  let x_21 : u32 = *(x);
  let x_24 : u32 = *(x);
  *(x) = (x_24 | (x_21 >> bitcast<u32>(2i)));
  let x_26 : u32 = *(x);
  let x_29 : u32 = *(x);
  *(x) = (x_29 | (x_26 >> bitcast<u32>(4i)));
  let x_31 : u32 = *(x);
  let x_34 : u32 = *(x);
  *(x) = (x_34 | (x_31 >> bitcast<u32>(8i)));
  let x_36 : u32 = *(x);
  let x_39 : u32 = *(x);
  *(x) = (x_39 | (x_36 >> bitcast<u32>(16i)));
  let x_41 : u32 = *(x);
  return (x_41 + 1u);
}

fn main_1() {
  var aligned_size : u32;
  var param : u32;
  var i : u32;
  var j : u32;
  var tmp : u32;
  var x_76 : bool;
  var x_77 : bool;
  let x_52 : u32 = x_48.size;
  param = u32(ceil((f32(x_52) / 256.0f)));
  let x_60 : u32 = next_pow2_u1_(&(param));
  aligned_size = (x_60 * 256u);
  let x_64 : u32 = aligned_size;
  let x_65 : bool = (x_64 < 256u);
  x_77 = x_65;
  if (x_65) {
    let x_74 : u32 = gl_GlobalInvocationID.x;
    x_76 = (x_74 > 128u);
    x_77 = x_76;
  }
  if (x_77) {
    return;
  }
  let x_83 : u32 = gl_GlobalInvocationID.x;
  i = x_83;
  let x_85 : u32 = aligned_size;
  let x_87 : u32 = gl_GlobalInvocationID.x;
  j = ((x_85 - x_87) - 1u);
  let x_95 : u32 = i;
  let x_97 : u32 = x_94.values[x_95];
  tmp = x_97;
  let x_98 : u32 = i;
  let x_99 : u32 = j;
  let x_101 : u32 = x_94.values[x_99];
  x_94.values[x_98] = x_101;
  let x_103 : u32 = j;
  let x_104 : u32 = tmp;
  x_94.values[x_103] = x_104;
  return;
}

@compute @workgroup_size(256i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const merge_sorted_chunks_comp_spv = `alias RTArr = array<u32>;

alias RTArr_1 = array<u32>;

struct InputKeys {
  input_keys : RTArr_1,
}

struct BufferInfo {
  size : u32,
}

struct NumWorkGroups {
  work_groups_x : u32,
}

alias RTArr_2 = array<u32>;

struct OutputKeys {
  output_keys : RTArr_1,
}

alias RTArr_3 = array<u32>;

struct OutputValues {
  output_values : RTArr_1,
}

struct InputValues {
  input_values : RTArr_1,
}

@group(1) @binding(0) var<storage, read_write> x_75 : InputKeys;

@group(0) @binding(0) var<uniform> x_132 : BufferInfo;

@group(2) @binding(0) var<uniform> x_149 : NumWorkGroups;

var<private> gl_WorkGroupID : vec3<u32>;

var<private> gl_LocalInvocationID : vec3<u32>;

@group(1) @binding(2) var<storage, read_write> x_231 : OutputKeys;

@group(1) @binding(3) var<storage, read_write> x_240 : OutputValues;

@group(1) @binding(1) var<storage, read_write> x_245 : InputValues;

fn next_pow2_u1_(x : ptr<function, u32>) -> u32 {
  let x_23 : u32 = *(x);
  *(x) = (x_23 - 1u);
  let x_26 : u32 = *(x);
  let x_30 : u32 = *(x);
  *(x) = (x_30 | (x_26 >> bitcast<u32>(1i)));
  let x_32 : u32 = *(x);
  let x_35 : u32 = *(x);
  *(x) = (x_35 | (x_32 >> bitcast<u32>(2i)));
  let x_37 : u32 = *(x);
  let x_40 : u32 = *(x);
  *(x) = (x_40 | (x_37 >> bitcast<u32>(4i)));
  let x_42 : u32 = *(x);
  let x_45 : u32 = *(x);
  *(x) = (x_45 | (x_42 >> bitcast<u32>(8i)));
  let x_47 : u32 = *(x);
  let x_50 : u32 = *(x);
  *(x) = (x_50 | (x_47 >> bitcast<u32>(16i)));
  let x_52 : u32 = *(x);
  return (x_52 + 1u);
}

fn upper_bound_u1_u1_u1_(start : ptr<function, u32>, count : ptr<function, u32>, element : ptr<function, u32>) -> u32 {
  var i : u32;
  loop {
    let x_61 : u32 = *(count);
    if ((x_61 > 0u)) {
    } else {
      break;
    }
    let x_66 : u32 = *(start);
    let x_67 : u32 = *(count);
    i = (x_66 + (x_67 / 2u));
    let x_71 : u32 = *(element);
    let x_77 : u32 = i;
    let x_80 : u32 = x_75.input_keys[x_77];
    if ((x_71 >= x_80)) {
      let x_84 : u32 = i;
      *(start) = (x_84 + 1u);
      let x_86 : u32 = *(count);
      let x_89 : u32 = *(count);
      *(count) = (x_89 - ((x_86 / 2u) + 1u));
    } else {
      let x_92 : u32 = *(count);
      *(count) = (x_92 / 2u);
    }
  }
  let x_94 : u32 = *(start);
  return x_94;
}

fn lower_bound_u1_u1_u1_(start_1 : ptr<function, u32>, count_1 : ptr<function, u32>, element_1 : ptr<function, u32>) -> u32 {
  var i_1 : u32;
  loop {
    let x_102 : u32 = *(count_1);
    if ((x_102 > 0u)) {
    } else {
      break;
    }
    let x_105 : u32 = *(start_1);
    let x_106 : u32 = *(count_1);
    i_1 = (x_105 + (x_106 / 2u));
    let x_109 : u32 = i_1;
    let x_111 : u32 = x_75.input_keys[x_109];
    let x_112 : u32 = *(element_1);
    if ((x_111 < x_112)) {
      let x_116 : u32 = i_1;
      *(start_1) = (x_116 + 1u);
      let x_118 : u32 = *(count_1);
      let x_121 : u32 = *(count_1);
      *(count_1) = (x_121 - ((x_118 / 2u) + 1u));
    } else {
      let x_124 : u32 = *(count_1);
      *(count_1) = (x_124 / 2u);
    }
  }
  let x_126 : u32 = *(start_1);
  return x_126;
}

fn main_1() {
  var aligned_size : u32;
  var param : u32;
  var merge_output_size : u32;
  var merge_chunk_size : u32;
  var offs : u32;
  var i_2 : u32;
  var a_in : u32;
  var b_in : u32;
  var base_idx : u32;
  var a_loc : u32;
  var param_1 : u32;
  var param_2 : u32;
  var param_3 : u32;
  var b_loc : u32;
  var param_4 : u32;
  var param_5 : u32;
  var param_6 : u32;
  let x_134 : u32 = x_132.size;
  param = u32(ceil((f32(x_134) / 256.0f)));
  let x_142 : u32 = next_pow2_u1_(&(param));
  aligned_size = (x_142 * 256u);
  let x_146 : u32 = aligned_size;
  let x_151 : u32 = x_149.work_groups_x;
  merge_output_size = (x_146 / x_151);
  let x_154 : u32 = merge_output_size;
  merge_chunk_size = (x_154 / 2u);
  let x_162 : u32 = gl_WorkGroupID.x;
  let x_163 : u32 = merge_output_size;
  offs = (x_162 * x_163);
  i_2 = 0u;
  loop {
    let x_171 : u32 = i_2;
    let x_172 : u32 = merge_chunk_size;
    if ((x_171 < (x_172 / 256u))) {
    } else {
      break;
    }
    let x_176 : u32 = offs;
    let x_177 : u32 = i_2;
    let x_182 : u32 = gl_LocalInvocationID.x;
    a_in = ((x_176 + (x_177 * 256u)) + x_182);
    let x_185 : u32 = offs;
    let x_186 : u32 = merge_chunk_size;
    let x_188 : u32 = i_2;
    let x_192 : u32 = gl_LocalInvocationID.x;
    b_in = (((x_185 + x_186) + (x_188 * 256u)) + x_192);
    let x_196 : u32 = gl_LocalInvocationID.x;
    let x_197 : u32 = i_2;
    base_idx = (x_196 + (x_197 * 256u));
    let x_201 : u32 = base_idx;
    let x_202 : u32 = offs;
    let x_203 : u32 = merge_chunk_size;
    let x_205 : u32 = a_in;
    param_1 = (x_202 + x_203);
    let x_208 : u32 = merge_chunk_size;
    param_2 = x_208;
    let x_211 : u32 = x_75.input_keys[x_205];
    param_3 = x_211;
    let x_212 : u32 = upper_bound_u1_u1_u1_(&(param_1), &(param_2), &(param_3));
    let x_214 : u32 = merge_chunk_size;
    a_loc = ((x_201 + x_212) - x_214);
    let x_217 : u32 = base_idx;
    let x_218 : u32 = b_in;
    let x_220 : u32 = offs;
    param_4 = x_220;
    let x_222 : u32 = merge_chunk_size;
    param_5 = x_222;
    let x_225 : u32 = x_75.input_keys[x_218];
    param_6 = x_225;
    let x_226 : u32 = lower_bound_u1_u1_u1_(&(param_4), &(param_5), &(param_6));
    b_loc = (x_217 + x_226);
    let x_232 : u32 = a_loc;
    let x_233 : u32 = a_in;
    let x_235 : u32 = x_75.input_keys[x_233];
    x_231.output_keys[x_232] = x_235;
    let x_241 : u32 = a_loc;
    let x_246 : u32 = a_in;
    let x_248 : u32 = x_245.input_values[x_246];
    x_240.output_values[x_241] = x_248;
    let x_250 : u32 = b_loc;
    let x_251 : u32 = b_in;
    let x_253 : u32 = x_75.input_keys[x_251];
    x_231.output_keys[x_250] = x_253;
    let x_255 : u32 = b_loc;
    let x_256 : u32 = b_in;
    let x_258 : u32 = x_245.input_values[x_256];
    x_240.output_values[x_255] = x_258;

    continuing {
      let x_260 : u32 = i_2;
      i_2 = (x_260 + bitcast<u32>(1i));
    }
  }
  return;
}

@compute @workgroup_size(256i, 1i, 1i)
fn main(@builtin(workgroup_id) gl_WorkGroupID_param : vec3<u32>, @builtin(local_invocation_id) gl_LocalInvocationID_param : vec3<u32>) {
  gl_WorkGroupID = gl_WorkGroupID_param;
  gl_LocalInvocationID = gl_LocalInvocationID_param;
  main_1();
}
`;

export const display_render_vert_spv = `var<private> gl_VertexIndex : i32;

var<private> gl_Position : vec4<f32>;

fn main_1() {
  var indexable : array<vec4<f32>, 6u>;
  let x_28 : i32 = gl_VertexIndex;
  indexable = array<vec4<f32>, 6u>(vec4<f32>(-1.0f, 1.0f, 0.5f, 1.0f), vec4<f32>(-1.0f, -1.0f, 0.5f, 1.0f), vec4<f32>(1.0f, 1.0f, 0.5f, 1.0f), vec4<f32>(-1.0f, -1.0f, 0.5f, 1.0f), vec4<f32>(1.0f, 1.0f, 0.5f, 1.0f), vec4<f32>(1.0f, -1.0f, 0.5f, 1.0f));
  let x_33 : vec4<f32> = indexable[x_28];
  gl_Position = x_33;
  return;
}

struct main_out {
  @builtin(position)
  gl_Position : vec4<f32>,
}

@vertex
fn main(@builtin(vertex_index) gl_VertexIndex_param : u32) -> main_out {
  gl_VertexIndex = bitcast<i32>(gl_VertexIndex_param);
  main_1();
  return main_out(gl_Position);
}
`;

export const display_render_frag_spv = `struct Resolution {
  width : u32,
  height : u32,
}

var<private> color : vec4<f32>;

@group(0) @binding(0) var output_texture : texture_2d<f32>;

@group(0) @binding(2) var u_sampler : sampler;

var<private> gl_FragCoord : vec4<f32>;

@group(0) @binding(1) var<uniform> x_28 : Resolution;

fn main_1() {
  let x_23 : vec4<f32> = gl_FragCoord;
  let x_33 : u32 = x_28.width;
  let x_37 : u32 = x_28.height;
  let x_41 : vec4<f32> = textureSample(output_texture, u_sampler, (vec2<f32>(x_23.x, x_23.y) / vec2<f32>(f32(x_33), f32(x_37))));
  color = x_41;
  color.w = 1.0f;
  return;
}

struct main_out {
  @location(0)
  color_1 : vec4<f32>,
}

@fragment
fn main(@builtin(position) gl_FragCoord_param : vec4<f32>) -> main_out {
  gl_FragCoord = gl_FragCoord_param;
  main_1();
  return main_out(color);
}
`;

export const reset_rays_comp_spv = `struct VolumeParams {
  volume_dims : vec4<u32>,
  padded_dims : vec4<u32>,
  volume_scale : vec4<f32>,
  max_bits : u32,
  isovalue : f32,
  image_width : u32,
}

struct RayInfo {
  ray_dir : vec3<f32>,
  t : f32,
}

alias RTArr = array<RayInfo>;

struct RayInformation {
  rays : RTArr,
}

struct ViewParams {
  proj_view : mat4x4<f32>,
  eye_pos : vec4<f32>,
  eye_dir : vec4<f32>,
  near_plane : f32,
  current_pass_index : u32,
  speculation_count : u32,
}

alias RTArr_1 = array<u32>;

struct RayBlockIDs {
  block_ids : RTArr_1,
}

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(1) var<uniform> x_19 : VolumeParams;

@group(0) @binding(0) var<storage, read_write> x_46 : RayInformation;

@group(0) @binding(3) var<uniform> x_68 : ViewParams;

@group(0) @binding(2) var<storage, read_write> x_75 : RayBlockIDs;

fn main_1() {
  var ray_index : u32;
  var i : u32;
  let x_13 : u32 = gl_GlobalInvocationID.x;
  let x_24 : u32 = x_19.image_width;
  if ((x_13 >= x_24)) {
    return;
  }
  let x_33 : u32 = gl_GlobalInvocationID.x;
  let x_36 : u32 = gl_GlobalInvocationID.y;
  let x_38 : u32 = x_19.image_width;
  ray_index = (x_33 + (x_36 * x_38));
  let x_48 : u32 = ray_index;
  x_46.rays[x_48].ray_dir = vec3<f32>(0.0f, 0.0f, 0.0f);
  let x_53 : u32 = ray_index;
  x_46.rays[x_53].t = 340282346638528859811704183484516925440.0f;
  i = 0u;
  loop {
    let x_64 : u32 = i;
    let x_70 : u32 = x_68.speculation_count;
    if ((x_64 < x_70)) {
    } else {
      break;
    }
    let x_76 : u32 = ray_index;
    let x_78 : u32 = x_68.speculation_count;
    let x_80 : u32 = i;
    x_75.block_ids[((x_76 * x_78) + x_80)] = 4294967295u;

    continuing {
      let x_84 : u32 = i;
      i = (x_84 + bitcast<u32>(1i));
    }
  }
  return;
}

@compute @workgroup_size(8i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const reset_block_active_comp_spv = `struct VolumeParams {
  volume_dims : vec4<u32>,
  padded_dims : vec4<u32>,
  volume_scale : vec4<f32>,
  max_bits : u32,
  isovalue : f32,
}

alias RTArr = array<u32>;

alias RTArr_1 = array<u32>;

struct BlockActive {
  block_active : RTArr_1,
}

struct BlockVisible {
  block_visible : RTArr_1,
}

@group(0) @binding(0) var<uniform> x_15 : VolumeParams;

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(1) var<storage, read_write> x_59 : BlockActive;

@group(0) @binding(2) var<storage, read_write> x_67 : BlockVisible;

fn main_1() {
  var n_blocks : vec3<u32>;
  var block_id : u32;
  let x_20 : vec4<u32> = x_15.padded_dims;
  n_blocks = (vec3<u32>(x_20.x, x_20.y, x_20.z) / vec3<u32>(4u, 4u, 4u));
  let x_30 : u32 = gl_GlobalInvocationID.x;
  let x_33 : u32 = n_blocks.x;
  if ((x_30 >= x_33)) {
    return;
  }
  let x_41 : u32 = gl_GlobalInvocationID.x;
  let x_43 : u32 = n_blocks.x;
  let x_46 : u32 = gl_GlobalInvocationID.y;
  let x_48 : u32 = n_blocks.y;
  let x_51 : u32 = gl_GlobalInvocationID.z;
  block_id = (x_41 + (x_43 * (x_46 + (x_48 * x_51))));
  let x_61 : u32 = block_id;
  x_59.block_active[x_61] = 0u;
  let x_68 : u32 = block_id;
  x_67.block_visible[x_68] = 0u;
  return;
}

@compute @workgroup_size(8i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const reset_block_num_rays_comp_spv = `struct BlockIDOffset {
  id_offset : u32,
  total_visible_blocks : u32,
}

alias RTArr = array<u32>;

struct BlockNumRays {
  block_num_rays : RTArr,
}

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(0) var<uniform> x_18 : BlockIDOffset;

@group(0) @binding(1) var<storage, read_write> x_37 : BlockNumRays;

fn main_1() {
  var block_id : u32;
  let x_15 : u32 = gl_GlobalInvocationID.x;
  let x_23 : u32 = x_18.id_offset;
  block_id = (x_15 + x_23);
  let x_25 : u32 = block_id;
  let x_28 : u32 = x_18.total_visible_blocks;
  if ((x_25 >= x_28)) {
    return;
  }
  let x_38 : u32 = block_id;
  x_37.block_num_rays[x_38] = 0u;
  return;
}

@compute @workgroup_size(32i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const debug_view_rays_per_block_comp_spv = `struct VolumeParams {
  volume_dims : vec4<u32>,
  padded_dims : vec4<u32>,
  volume_scale : vec4<f32>,
  max_bits : u32,
  isovalue : f32,
  image_width : u32,
}

struct RayInfo {
  ray_dir : vec3<f32>,
  t : f32,
}

alias RTArr = array<RayInfo>;

struct RayInformation {
  rays : RTArr,
}

alias RTArr_1 = array<u32>;

alias RTArr_2 = array<u32>;

struct RayBlockIDs {
  block_ids : RTArr_2,
}

struct BlockNumRays {
  block_num_rays : RTArr_2,
}

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(0) var<uniform> x_24 : VolumeParams;

@group(0) @binding(2) var<storage, read_write> x_37 : RayInformation;

@group(0) @binding(4) var<storage, read_write> x_54 : RayBlockIDs;

@group(0) @binding(1) var<storage, read_write> x_63 : BlockNumRays;

@group(0) @binding(3) var render_target : texture_storage_2d<rgba8unorm, write>;

fn main_1() {
  var ray_index : u32;
  var block_id : u32;
  var color : vec4<f32>;
  let x_15 : u32 = gl_GlobalInvocationID.x;
  let x_18 : u32 = gl_GlobalInvocationID.y;
  let x_29 : u32 = x_24.image_width;
  ray_index = (x_15 + (x_18 * x_29));
  let x_39 : u32 = ray_index;
  let x_43 : f32 = x_37.rays[x_39].t;
  if ((x_43 == 340282346638528859811704183484516925440.0f)) {
    return;
  }
  let x_55 : u32 = ray_index;
  let x_57 : u32 = x_54.block_ids[x_55];
  block_id = x_57;
  let x_64 : u32 = block_id;
  let x_66 : u32 = x_63.block_num_rays[x_64];
  let x_69 : f32 = (f32(x_66) / 256.0f);
  let x_70 : vec3<f32> = vec3<f32>(x_69, x_69, x_69);
  let x_71 : vec4<f32> = color;
  color = vec4<f32>(x_70.x, x_70.y, x_70.z, x_71.w);
  color.w = 1.0f;
  let x_82 : vec3<u32> = gl_GlobalInvocationID;
  let x_86 : vec4<f32> = color;
  textureStore(render_target, bitcast<vec2<i32>>(vec2<u32>(x_82.x, x_82.y)), x_86);
  return;
}

@compute @workgroup_size(1i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const write_ray_and_block_id_comp_spv = `struct VolumeParams {
  volume_dims : vec4<u32>,
  padded_dims : vec4<u32>,
  volume_scale : vec4<f32>,
  max_bits : u32,
  isovalue : f32,
  image_width : u32,
}

alias RTArr = array<u32>;

alias RTArr_1 = array<u32>;

struct RayActive {
  ray_active : RTArr_1,
}

struct RayBlockID {
  block_id : RTArr_1,
}

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(0) var<uniform> x_19 : VolumeParams;

@group(0) @binding(2) var<storage, read_write> x_44 : RayActive;

@group(0) @binding(1) var<storage, read_write> x_50 : RayBlockID;

fn main_1() {
  var ray_index : u32;
  let x_13 : u32 = gl_GlobalInvocationID.x;
  let x_24 : u32 = x_19.image_width;
  if ((x_13 >= x_24)) {
    return;
  }
  let x_33 : u32 = gl_GlobalInvocationID.x;
  let x_36 : u32 = gl_GlobalInvocationID.y;
  let x_38 : u32 = x_19.image_width;
  ray_index = (x_33 + (x_36 * x_38));
  let x_46 : u32 = ray_index;
  let x_51 : u32 = ray_index;
  let x_53 : u32 = x_50.block_id[x_51];
  x_44.ray_active[x_46] = bitcast<u32>(select(0i, 1i, (x_53 != 4294967295u)));
  return;
}

@compute @workgroup_size(8i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const combine_block_information_comp_spv = `struct BlockIDOffset {
  id_offset : u32,
  total_work_groups : u32,
  total_active_blocks : u32,
}

alias RTArr = array<u32>;

alias RTArr_1 = array<u32>;

struct BlockIDs {
  block_ids : RTArr_1,
}

struct BlockInfo {
  id : u32,
  ray_offset : u32,
  num_rays : u32,
  lod : u32,
}

alias RTArr_2 = array<BlockInfo>;

struct BlockInformation {
  blocks : RTArr_2,
}

alias RTArr_3 = array<u32>;

struct BlockRayOffset {
  block_ray_offsets : RTArr_1,
}

alias RTArr_4 = array<u32>;

struct BlockNumRays {
  block_num_rays : RTArr_1,
}

struct BlockActive {
  block_active : RTArr_1,
}

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(1) @binding(0) var<uniform> x_18 : BlockIDOffset;

@group(0) @binding(1) var<storage, read_write> x_40 : BlockIDs;

@group(0) @binding(0) var<storage, read_write> x_48 : BlockInformation;

@group(0) @binding(2) var<storage, read_write> x_57 : BlockRayOffset;

@group(0) @binding(3) var<storage, read_write> x_66 : BlockNumRays;

@group(0) @binding(4) var<storage, read_write> x_79 : BlockActive;

fn main_1() {
  var item_idx : u32;
  var id : u32;
  let x_15 : u32 = gl_GlobalInvocationID.x;
  let x_23 : u32 = x_18.id_offset;
  item_idx = (x_15 + (x_23 * 64u));
  let x_27 : u32 = item_idx;
  let x_30 : u32 = x_18.total_active_blocks;
  if ((x_27 >= x_30)) {
    return;
  }
  let x_41 : u32 = item_idx;
  let x_43 : u32 = x_40.block_ids[x_41];
  id = x_43;
  let x_49 : u32 = item_idx;
  let x_50 : u32 = id;
  x_48.blocks[x_49].id = x_50;
  let x_52 : u32 = item_idx;
  let x_58 : u32 = item_idx;
  let x_60 : u32 = x_57.block_ray_offsets[x_58];
  x_48.blocks[x_52].ray_offset = x_60;
  let x_62 : u32 = item_idx;
  let x_67 : u32 = item_idx;
  let x_69 : u32 = x_66.block_num_rays[x_67];
  x_48.blocks[x_62].num_rays = x_69;
  let x_71 : u32 = item_idx;
  x_48.blocks[x_71].lod = 0u;
  return;
}

@compute @workgroup_size(64i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const raytrace_active_block_comp_spv = `struct GridIterator {
  grid_dims : vec3<i32>,
  grid_step : vec3<i32>,
  t_delta : vec3<f32>,
  cell : vec3<i32>,
  t_max : vec3<f32>,
  t : f32,
}

struct VolumeParams {
  volume_dims : vec4<u32>,
  padded_dims : vec4<u32>,
  volume_scale : vec4<f32>,
  max_bits : u32,
  isovalue : f32,
  image_width : u32,
}

alias RTArr = array<i32>;

struct BlockLocations {
  block_locations : RTArr,
}

alias RTArr_1 = array<f32>;

struct Decompressed {
  decompressed : RTArr_1,
}

struct BlockInfo {
  id : u32,
  ray_offset : u32,
  num_rays : u32,
  lod : u32,
}

struct BlockInfo_1 {
  id : u32,
  ray_offset : u32,
  num_rays : u32,
  lod : u32,
}

alias RTArr_2 = array<BlockInfo_1>;

struct BlockInformation {
  blocks : RTArr_2,
}

struct BlockIDOffset {
  id_offset : u32,
  total_active_blocks : u32,
}

struct ViewParams {
  proj_view : mat4x4<f32>,
  eye_pos : vec4<f32>,
  eye_dir : vec4<f32>,
  near_plane : f32,
  current_pass_index : u32,
}

alias RTArr_3 = array<u32>;

alias RTArr_4 = array<u32>;

struct RayIDs {
  ray_ids : RTArr_4,
}

struct SpeculativeIDs {
  spec_ids : RTArr_4,
}

struct RayInfo {
  ray_dir : vec3<f32>,
  t : f32,
}

alias RTArr_5 = array<RayInfo>;

struct RayInformation {
  rays : RTArr_5,
}

alias RTArr_6 = array<vec2<f32>>;

struct RayRGBZ {
  ray_rgbz : RTArr_6,
}

@group(0) @binding(0) var<uniform> x_409 : VolumeParams;

var<workgroup> volume_block : array<f32, 128u>;

@group(0) @binding(2) var<storage, read_write> x_621 : BlockLocations;

@group(0) @binding(1) var<storage, read_write> x_760 : Decompressed;

var<private> gl_LocalInvocationID : vec3<u32>;

var<workgroup> block_info : BlockInfo;

@group(1) @binding(3) var<storage, read_write> x_1563 : BlockInformation;

var<private> gl_WorkGroupID : vec3<u32>;

@group(2) @binding(0) var<uniform> x_1569 : BlockIDOffset;

@group(1) @binding(0) var<uniform> x_1629 : ViewParams;

@group(1) @binding(2) var<storage, read_write> x_1695 : RayIDs;

@group(1) @binding(5) var<storage, read_write> x_1710 : SpeculativeIDs;

@group(1) @binding(1) var<storage, read_write> x_1722 : RayInformation;

@group(1) @binding(6) var<storage, read_write> x_1877 : RayRGBZ;

@group(1) @binding(4) var render_target : texture_storage_2d<rgba8unorm, write>;

fn block_id_to_pos_u1_(id_1 : ptr<function, u32>) -> vec3<u32> {
  var n_blocks : vec3<u32>;
  let x_424 : vec4<u32> = x_409.padded_dims;
  n_blocks = (vec3<u32>(x_424.x, x_424.y, x_424.z) / vec3<u32>(4u, 4u, 4u));
  let x_429 : u32 = *(id_1);
  let x_431 : u32 = n_blocks.x;
  let x_433 : u32 = *(id_1);
  let x_435 : u32 = n_blocks.x;
  let x_438 : u32 = n_blocks.y;
  let x_440 : u32 = *(id_1);
  let x_442 : u32 = n_blocks.x;
  let x_444 : u32 = n_blocks.y;
  return vec3<u32>((x_429 % x_431), ((x_433 / x_435) % x_438), (x_440 / (x_442 * x_444)));
}

fn compute_block_id_vu3_(block_pos : ptr<function, vec3<u32>>) -> u32 {
  var n_blocks_1 : vec3<u32>;
  let x_452 : vec4<u32> = x_409.padded_dims;
  n_blocks_1 = (vec3<u32>(x_452.x, x_452.y, x_452.z) / vec3<u32>(4u, 4u, 4u));
  let x_456 : u32 = (*(block_pos)).x;
  let x_458 : u32 = n_blocks_1.x;
  let x_460 : u32 = (*(block_pos)).y;
  let x_462 : u32 = n_blocks_1.y;
  let x_464 : u32 = (*(block_pos)).z;
  return (x_456 + (x_458 * (x_460 + (x_462 * x_464))));
}

fn compute_block_dims_with_ghost_vu3_(block_pos_1 : vec3<u32>) -> vec3<u32> {
  var n_blocks_2 : vec3<u32>;
  var block_dims_3 : vec3<u32>;
  var corner : u32;
  var param : vec3<u32>;
  var edge : u32;
  var param_1 : vec3<u32>;
  var edge_1 : u32;
  var param_2 : vec3<u32>;
  var edge_2 : u32;
  var param_3 : vec3<u32>;
  var face : u32;
  var param_4 : vec3<u32>;
  var face_1 : u32;
  var param_5 : vec3<u32>;
  var face_2 : u32;
  var param_6 : vec3<u32>;
  let x_578 : vec4<u32> = x_409.padded_dims;
  n_blocks_2 = (vec3<u32>(x_578.x, x_578.y, x_578.z) / vec3<u32>(4u, 4u, 4u));
  block_dims_3 = vec3<u32>(4u, 4u, 4u);
  let x_585 : u32 = n_blocks_2.x;
  if (((block_pos_1.x + 1u) < x_585)) {
    block_dims_3.x = 5u;
  }
  let x_594 : u32 = n_blocks_2.y;
  if (((block_pos_1.y + 1u) < x_594)) {
    block_dims_3.y = 5u;
  }
  let x_602 : u32 = n_blocks_2.z;
  if (((block_pos_1.z + 1u) < x_602)) {
    block_dims_3.z = 5u;
  }
  let x_607 : vec3<u32> = block_dims_3;
  if (all((x_607 == vec3<u32>(5u, 5u, 5u)))) {
    param = (block_pos_1 + vec3<u32>(1u, 1u, 1u));
    let x_617 : u32 = compute_block_id_vu3_(&(param));
    corner = x_617;
    let x_622 : u32 = corner;
    let x_625 : i32 = x_621.block_locations[x_622];
    if ((x_625 == -1i)) {
      block_dims_3 = vec3<u32>(4u, 4u, 4u);
    }
  }
  let x_630 : vec3<u32> = block_dims_3;
  if (all((vec2<u32>(x_630.x, x_630.y) == vec2<u32>(5u, 5u)))) {
    param_1 = (block_pos_1 + vec3<u32>(1u, 1u, 0u));
    let x_642 : u32 = compute_block_id_vu3_(&(param_1));
    edge = x_642;
    let x_643 : u32 = edge;
    let x_645 : i32 = x_621.block_locations[x_643];
    if ((x_645 == -1i)) {
      let x_650 : vec3<u32> = block_dims_3;
      block_dims_3 = vec3<u32>(vec2<u32>(4u, 4u).x, vec2<u32>(4u, 4u).y, x_650.z);
    }
  }
  let x_652 : vec3<u32> = block_dims_3;
  if (all((vec2<u32>(x_652.x, x_652.z) == vec2<u32>(5u, 5u)))) {
    param_2 = (block_pos_1 + vec3<u32>(1u, 0u, 1u));
    let x_662 : u32 = compute_block_id_vu3_(&(param_2));
    edge_1 = x_662;
    let x_663 : u32 = edge_1;
    let x_665 : i32 = x_621.block_locations[x_663];
    if ((x_665 == -1i)) {
      let x_669 : vec3<u32> = block_dims_3;
      block_dims_3 = vec3<u32>(vec2<u32>(4u, 4u).x, x_669.y, vec2<u32>(4u, 4u).y);
    }
  }
  let x_671 : vec3<u32> = block_dims_3;
  if (all((vec2<u32>(x_671.y, x_671.z) == vec2<u32>(5u, 5u)))) {
    param_3 = (block_pos_1 + vec3<u32>(0u, 1u, 1u));
    let x_681 : u32 = compute_block_id_vu3_(&(param_3));
    edge_2 = x_681;
    let x_682 : u32 = edge_2;
    let x_684 : i32 = x_621.block_locations[x_682];
    if ((x_684 == -1i)) {
      let x_688 : vec3<u32> = block_dims_3;
      block_dims_3 = vec3<u32>(x_688.x, vec2<u32>(4u, 4u).x, vec2<u32>(4u, 4u).y);
    }
  }
  let x_691 : u32 = block_dims_3.x;
  if ((x_691 == 5u)) {
    param_4 = (block_pos_1 + vec3<u32>(1u, 0u, 0u));
    let x_699 : u32 = compute_block_id_vu3_(&(param_4));
    face = x_699;
    let x_700 : u32 = face;
    let x_702 : i32 = x_621.block_locations[x_700];
    if ((x_702 == -1i)) {
      block_dims_3.x = 4u;
    }
  }
  let x_708 : u32 = block_dims_3.y;
  if ((x_708 == 5u)) {
    param_5 = (block_pos_1 + vec3<u32>(0u, 1u, 0u));
    let x_716 : u32 = compute_block_id_vu3_(&(param_5));
    face_1 = x_716;
    let x_717 : u32 = face_1;
    let x_719 : i32 = x_621.block_locations[x_717];
    if ((x_719 == -1i)) {
      block_dims_3.y = 4u;
    }
  }
  let x_725 : u32 = block_dims_3.z;
  if ((x_725 == 5u)) {
    param_6 = (block_pos_1 + vec3<u32>(0u, 0u, 1u));
    let x_733 : u32 = compute_block_id_vu3_(&(param_6));
    face_2 = x_733;
    let x_734 : u32 = face_2;
    let x_736 : i32 = x_621.block_locations[x_734];
    if ((x_736 == -1i)) {
      block_dims_3.z = 4u;
    }
  }
  let x_741 : vec3<u32> = block_dims_3;
  return x_741;
}

fn voxel_id_to_voxel_u1_(id_2 : ptr<function, u32>) -> vec3<u32> {
  let x_471 : u32 = *(id_2);
  let x_473 : u32 = *(id_2);
  let x_476 : u32 = *(id_2);
  return vec3<u32>((x_471 % 4u), ((x_473 / 4u) % 4u), (x_476 / 16u));
}

fn compute_voxel_id_vu3_vu3_(voxel_pos : ptr<function, vec3<u32>>, block_dims : ptr<function, vec3<u32>>) -> u32 {
  let x_483 : u32 = (*(voxel_pos)).x;
  let x_485 : u32 = (*(block_dims)).x;
  let x_487 : u32 = (*(voxel_pos)).y;
  let x_489 : u32 = (*(block_dims)).y;
  let x_491 : u32 = (*(voxel_pos)).z;
  return (x_483 + (x_485 * (x_487 + (x_489 * x_491))));
}

fn load_voxel_u1_vu3_vu3_vu3_(neighbor_id : u32, ghost_voxel_pos : vec3<u32>, neighbor_voxel_pos : vec3<u32>, block_dims_2 : vec3<u32>) {
  var neighbor_location : u32;
  var ghost_voxel_id : u32;
  var param_7 : vec3<u32>;
  var param_8 : vec3<u32>;
  var neighbor_voxel_id : u32;
  var param_9 : vec3<u32>;
  var param_10 : vec3<u32>;
  let x_746 : i32 = x_621.block_locations[neighbor_id];
  neighbor_location = bitcast<u32>(x_746);
  param_7 = ghost_voxel_pos;
  param_8 = block_dims_2;
  let x_751 : u32 = compute_voxel_id_vu3_vu3_(&(param_7), &(param_8));
  ghost_voxel_id = x_751;
  param_9 = neighbor_voxel_pos;
  param_10 = vec3<u32>(4u, 4u, 4u);
  let x_755 : u32 = compute_voxel_id_vu3_vu3_(&(param_9), &(param_10));
  neighbor_voxel_id = x_755;
  let x_756 : u32 = ghost_voxel_id;
  let x_761 : u32 = neighbor_location;
  let x_764 : u32 = neighbor_voxel_id;
  let x_768 : f32 = x_760.decompressed[((x_761 * 64u) + x_764)];
  volume_block[x_756] = x_768;
  return;
}

fn load_block_u1_(block_id : u32) -> vec3<u32> {
  var block_pos_2 : vec3<u32>;
  var param_11 : u32;
  var n_blocks_3 : vec3<u32>;
  var block_dims_4 : vec3<u32>;
  var voxel_pos_2 : vec3<u32>;
  var param_12 : u32;
  var i_1 : u32;
  var ghost_voxel_pos_1 : vec3<u32>;
  var indexable_1 : array<vec3<u32>, 3u>;
  var neighbor_voxel_pos_1 : vec3<u32>;
  var indexable_2 : array<vec3<u32>, 3u>;
  var indexable_3 : array<vec3<u32>, 3u>;
  var neighbor_block_pos : vec3<u32>;
  var indexable_4 : array<vec3<u32>, 3u>;
  var neighbor_id_1 : u32;
  var param_13 : vec3<u32>;
  var i_2 : u32;
  var b : vec3<u32>;
  var indexable_5 : array<vec3<u32>, 3u>;
  var p_3 : vec3<u32>;
  var indexable_6 : array<vec3<u32>, 3u>;
  var ghost_voxel_pos_2 : vec3<u32>;
  var indexable_7 : array<vec3<u32>, 3u>;
  var neighbor_voxel_pos_2 : vec3<u32>;
  var indexable_8 : array<vec3<u32>, 3u>;
  var indexable_9 : array<vec3<u32>, 3u>;
  var indexable_10 : array<vec3<u32>, 3u>;
  var neighbor_block_pos_1 : vec3<u32>;
  var indexable_11 : array<vec3<u32>, 3u>;
  var neighbor_id_2 : u32;
  var param_14 : vec3<u32>;
  var ghost_voxel_pos_3 : vec3<u32>;
  var neighbor_block_pos_2 : vec3<u32>;
  var neighbor_id_3 : u32;
  var param_15 : vec3<u32>;
  let x_774 : u32 = gl_LocalInvocationID.x;
  volume_block[(x_774 * 2u)] = 0.0f;
  let x_778 : u32 = gl_LocalInvocationID.x;
  volume_block[((x_778 * 2u) + 1u)] = 0.0f;
  workgroupBarrier();
  param_11 = block_id;
  let x_785 : vec3<u32> = block_id_to_pos_u1_(&(param_11));
  block_pos_2 = x_785;
  let x_788 : vec4<u32> = x_409.padded_dims;
  n_blocks_3 = (vec3<u32>(x_788.x, x_788.y, x_788.z) / vec3<u32>(4u, 4u, 4u));
  let x_792 : vec3<u32> = block_pos_2;
  let x_793 : vec3<u32> = compute_block_dims_with_ghost_vu3_(x_792);
  block_dims_4 = x_793;
  let x_797 : u32 = gl_LocalInvocationID.x;
  param_12 = x_797;
  let x_798 : vec3<u32> = voxel_id_to_voxel_u1_(&(param_12));
  voxel_pos_2 = x_798;
  let x_799 : vec3<u32> = voxel_pos_2;
  let x_800 : vec3<u32> = voxel_pos_2;
  let x_801 : vec3<u32> = block_dims_4;
  load_voxel_u1_vu3_vu3_vu3_(block_id, x_799, x_800, x_801);
  i_1 = 0u;
  loop {
    var x_821 : bool;
    var x_822 : bool;
    let x_809 : u32 = i_1;
    if ((x_809 < 3u)) {
    } else {
      break;
    }
    let x_812 : u32 = i_1;
    let x_814 : u32 = block_dims_4[x_812];
    let x_815 : bool = (x_814 == 5u);
    x_822 = x_815;
    if (x_815) {
      let x_818 : u32 = i_1;
      let x_820 : u32 = voxel_pos_2[x_818];
      x_821 = (x_820 == 3u);
      x_822 = x_821;
    }
    if (x_822) {
      let x_826 : vec3<u32> = voxel_pos_2;
      let x_829 : u32 = i_1;
      indexable_1 = array<vec3<u32>, 3u>(vec3<u32>(1u, 0u, 0u), vec3<u32>(0u, 1u, 0u), vec3<u32>(0u, 0u, 1u));
      let x_833 : vec3<u32> = indexable_1[x_829];
      ghost_voxel_pos_1 = (x_826 + x_833);
      let x_836 : vec3<u32> = ghost_voxel_pos_1;
      neighbor_voxel_pos_1 = x_836;
      let x_837 : u32 = i_1;
      indexable_2 = array<vec3<u32>, 3u>(vec3<u32>(1u, 0u, 0u), vec3<u32>(0u, 1u, 0u), vec3<u32>(0u, 0u, 1u));
      let x_840 : u32 = indexable_2[x_837].x;
      if ((x_840 == 1u)) {
        neighbor_voxel_pos_1.x = 0u;
      } else {
        let x_846 : u32 = i_1;
        indexable_3 = array<vec3<u32>, 3u>(vec3<u32>(1u, 0u, 0u), vec3<u32>(0u, 1u, 0u), vec3<u32>(0u, 0u, 1u));
        let x_849 : u32 = indexable_3[x_846].y;
        if ((x_849 == 1u)) {
          neighbor_voxel_pos_1.y = 0u;
        } else {
          neighbor_voxel_pos_1.z = 0u;
        }
      }
      let x_857 : vec3<u32> = block_pos_2;
      let x_858 : u32 = i_1;
      indexable_4 = array<vec3<u32>, 3u>(vec3<u32>(1u, 0u, 0u), vec3<u32>(0u, 1u, 0u), vec3<u32>(0u, 0u, 1u));
      let x_861 : vec3<u32> = indexable_4[x_858];
      neighbor_block_pos = (x_857 + x_861);
      let x_865 : vec3<u32> = neighbor_block_pos;
      param_13 = x_865;
      let x_866 : u32 = compute_block_id_vu3_(&(param_13));
      neighbor_id_1 = x_866;
      let x_867 : u32 = neighbor_id_1;
      let x_868 : vec3<u32> = ghost_voxel_pos_1;
      let x_869 : vec3<u32> = neighbor_voxel_pos_1;
      let x_870 : vec3<u32> = block_dims_4;
      load_voxel_u1_vu3_vu3_vu3_(x_867, x_868, x_869, x_870);
    }

    continuing {
      let x_872 : u32 = i_1;
      i_1 = (x_872 + bitcast<u32>(1i));
    }
  }
  i_2 = 0u;
  loop {
    var x_918 : bool;
    var x_919 : bool;
    let x_880 : u32 = i_2;
    if ((x_880 < 3u)) {
    } else {
      break;
    }
    let x_883 : vec3<u32> = block_dims_4;
    let x_885 : u32 = i_2;
    indexable_5 = array<vec3<u32>, 3u>(vec3<u32>(1u, 1u, 0u), vec3<u32>(1u, 0u, 1u), vec3<u32>(0u, 1u, 1u));
    let x_888 : vec3<u32> = indexable_5[x_885];
    b = (x_883 * x_888);
    let x_891 : vec3<u32> = voxel_pos_2;
    let x_892 : u32 = i_2;
    indexable_6 = array<vec3<u32>, 3u>(vec3<u32>(1u, 1u, 0u), vec3<u32>(1u, 0u, 1u), vec3<u32>(0u, 1u, 1u));
    let x_895 : vec3<u32> = indexable_6[x_892];
    p_3 = (x_891 * x_895);
    let x_898 : u32 = b.x;
    let x_900 : u32 = b.y;
    let x_903 : u32 = b.z;
    let x_906 : bool = (((x_898 + x_900) + x_903) == 10u);
    x_919 = x_906;
    if (x_906) {
      let x_910 : u32 = p_3.x;
      let x_912 : u32 = p_3.y;
      let x_915 : u32 = p_3.z;
      x_918 = (((x_910 + x_912) + x_915) == 6u);
      x_919 = x_918;
    }
    if (x_919) {
      let x_923 : vec3<u32> = voxel_pos_2;
      let x_924 : u32 = i_2;
      indexable_7 = array<vec3<u32>, 3u>(vec3<u32>(1u, 1u, 0u), vec3<u32>(1u, 0u, 1u), vec3<u32>(0u, 1u, 1u));
      let x_927 : vec3<u32> = indexable_7[x_924];
      ghost_voxel_pos_2 = (x_923 + x_927);
      let x_930 : vec3<u32> = ghost_voxel_pos_2;
      neighbor_voxel_pos_2 = x_930;
      let x_931 : u32 = i_2;
      indexable_8 = array<vec3<u32>, 3u>(vec3<u32>(1u, 1u, 0u), vec3<u32>(1u, 0u, 1u), vec3<u32>(0u, 1u, 1u));
      let x_934 : u32 = indexable_8[x_931].x;
      if ((x_934 == 1u)) {
        neighbor_voxel_pos_2.x = 0u;
      }
      let x_939 : u32 = i_2;
      indexable_9 = array<vec3<u32>, 3u>(vec3<u32>(1u, 1u, 0u), vec3<u32>(1u, 0u, 1u), vec3<u32>(0u, 1u, 1u));
      let x_942 : u32 = indexable_9[x_939].y;
      if ((x_942 == 1u)) {
        neighbor_voxel_pos_2.y = 0u;
      }
      let x_947 : u32 = i_2;
      indexable_10 = array<vec3<u32>, 3u>(vec3<u32>(1u, 1u, 0u), vec3<u32>(1u, 0u, 1u), vec3<u32>(0u, 1u, 1u));
      let x_950 : u32 = indexable_10[x_947].z;
      if ((x_950 == 1u)) {
        neighbor_voxel_pos_2.z = 0u;
      }
      let x_956 : vec3<u32> = block_pos_2;
      let x_957 : u32 = i_2;
      indexable_11 = array<vec3<u32>, 3u>(vec3<u32>(1u, 1u, 0u), vec3<u32>(1u, 0u, 1u), vec3<u32>(0u, 1u, 1u));
      let x_960 : vec3<u32> = indexable_11[x_957];
      neighbor_block_pos_1 = (x_956 + x_960);
      let x_964 : vec3<u32> = neighbor_block_pos_1;
      param_14 = x_964;
      let x_965 : u32 = compute_block_id_vu3_(&(param_14));
      neighbor_id_2 = x_965;
      let x_966 : u32 = neighbor_id_2;
      let x_967 : vec3<u32> = ghost_voxel_pos_2;
      let x_968 : vec3<u32> = neighbor_voxel_pos_2;
      let x_969 : vec3<u32> = block_dims_4;
      load_voxel_u1_vu3_vu3_vu3_(x_966, x_967, x_968, x_969);
    }

    continuing {
      let x_971 : u32 = i_2;
      i_2 = (x_971 + bitcast<u32>(1i));
    }
  }
  let x_973 : vec3<u32> = block_dims_4;
  let x_976 : vec3<u32> = voxel_pos_2;
  if ((all((x_973 == vec3<u32>(5u, 5u, 5u))) & all((x_976 == vec3<u32>(3u, 3u, 3u))))) {
    let x_984 : vec3<u32> = voxel_pos_2;
    ghost_voxel_pos_3 = (x_984 + vec3<u32>(1u, 1u, 1u));
    let x_987 : vec3<u32> = block_pos_2;
    neighbor_block_pos_2 = (x_987 + vec3<u32>(1u, 1u, 1u));
    let x_991 : vec3<u32> = neighbor_block_pos_2;
    param_15 = x_991;
    let x_992 : u32 = compute_block_id_vu3_(&(param_15));
    neighbor_id_3 = x_992;
    let x_993 : u32 = neighbor_id_3;
    let x_994 : vec3<u32> = ghost_voxel_pos_3;
    let x_996 : vec3<u32> = block_dims_4;
    load_voxel_u1_vu3_vu3_vu3_(x_993, x_994, vec3<u32>(0u, 0u, 0u), x_996);
  }
  workgroupBarrier();
  let x_998 : vec3<u32> = block_dims_4;
  return x_998;
}

fn ray_id_to_pos_u1_(id : ptr<function, u32>) -> vec2<u32> {
  let x_405 : u32 = *(id);
  let x_412 : u32 = x_409.image_width;
  let x_414 : u32 = *(id);
  let x_416 : u32 = x_409.image_width;
  return vec2<u32>((x_405 % x_412), (x_414 / x_416));
}

fn intersect_box_vf3_vf3_vf3_vf3_(orig : ptr<function, vec3<f32>>, dir : ptr<function, vec3<f32>>, box_min : vec3<f32>, box_max : vec3<f32>) -> vec2<f32> {
  var inv_dir : vec3<f32>;
  var tmin_tmp : vec3<f32>;
  var tmax_tmp : vec3<f32>;
  var tmin : vec3<f32>;
  var tmax : vec3<f32>;
  var t0 : f32;
  var t1 : f32;
  let x_325 : vec3<f32> = *(dir);
  inv_dir = (vec3<f32>(1.0f, 1.0f, 1.0f) / x_325);
  let x_329 : vec3<f32> = *(orig);
  let x_331 : vec3<f32> = inv_dir;
  tmin_tmp = ((box_min - x_329) * x_331);
  let x_334 : vec3<f32> = *(orig);
  let x_336 : vec3<f32> = inv_dir;
  tmax_tmp = ((box_max - x_334) * x_336);
  let x_339 : vec3<f32> = tmin_tmp;
  let x_340 : vec3<f32> = tmax_tmp;
  tmin = min(x_339, x_340);
  let x_343 : vec3<f32> = tmin_tmp;
  let x_344 : vec3<f32> = tmax_tmp;
  tmax = max(x_343, x_344);
  let x_348 : f32 = tmin.x;
  let x_350 : f32 = tmin.y;
  let x_352 : f32 = tmin.z;
  t0 = max(x_348, max(x_350, x_352));
  let x_357 : f32 = tmax.x;
  let x_359 : f32 = tmax.y;
  let x_361 : f32 = tmax.z;
  t1 = min(x_357, min(x_359, x_361));
  let x_364 : f32 = t0;
  let x_365 : f32 = t1;
  return vec2<f32>(x_364, x_365);
}

fn init_grid_iterator_vf3_vf3_f1_vi3_(ray_org : ptr<function, vec3<f32>>, ray_dir : ptr<function, vec3<f32>>, t : ptr<function, f32>, grid_dims_1 : ptr<function, vec3<i32>>) -> GridIterator {
  var grid_iter : GridIterator;
  var inv_ray_dir : vec3<f32>;
  var p_2 : vec3<f32>;
  var cell : vec3<f32>;
  var t_max_neg : vec3<f32>;
  var t_max_pos : vec3<f32>;
  var is_neg_dir : vec3<bool>;
  let x_159 : vec3<i32> = *(grid_dims_1);
  grid_iter.grid_dims = x_159;
  let x_162 : vec3<f32> = *(ray_dir);
  grid_iter.grid_step = vec3<i32>(sign(x_162));
  let x_168 : vec3<f32> = *(ray_dir);
  inv_ray_dir = (vec3<f32>(1.0f, 1.0f, 1.0f) / x_168);
  let x_172 : vec3<f32> = inv_ray_dir;
  grid_iter.t_delta = abs(x_172);
  let x_176 : vec3<f32> = *(ray_org);
  let x_177 : f32 = *(t);
  let x_178 : vec3<f32> = *(ray_dir);
  p_2 = (x_176 + (x_178 * x_177));
  let x_181 : vec3<f32> = p_2;
  let x_184 : vec3<i32> = *(grid_dims_1);
  p_2 = clamp(x_181, vec3<f32>(0.0f, 0.0f, 0.0f), vec3<f32>((x_184 - vec3<i32>(1i, 1i, 1i))));
  let x_190 : vec3<f32> = p_2;
  cell = floor(x_190);
  let x_193 : vec3<f32> = cell;
  let x_194 : vec3<f32> = *(ray_org);
  let x_196 : vec3<f32> = inv_ray_dir;
  t_max_neg = ((x_193 - x_194) * x_196);
  let x_199 : vec3<f32> = cell;
  let x_202 : vec3<f32> = *(ray_org);
  let x_204 : vec3<f32> = inv_ray_dir;
  t_max_pos = (((x_199 + vec3<f32>(1.0f, 1.0f, 1.0f)) - x_202) * x_204);
  let x_208 : vec3<f32> = *(ray_dir);
  is_neg_dir = (x_208 < vec3<f32>(0.0f, 0.0f, 0.0f));
  let x_211 : vec3<f32> = t_max_pos;
  let x_212 : vec3<f32> = t_max_neg;
  let x_213 : vec3<bool> = is_neg_dir;
  grid_iter.t_max = select(x_211, x_212, x_213);
  let x_217 : vec3<f32> = cell;
  grid_iter.cell = vec3<i32>(x_217);
  let x_221 : f32 = *(t);
  grid_iter.t = x_221;
  let x_223 : GridIterator = grid_iter;
  return x_223;
}

fn outside_grid_vi3_vi3_(p : vec3<i32>, grid_dims : vec3<i32>) -> bool {
  var x_154 : bool;
  var x_155 : bool;
  let x_149 : bool = any((p < vec3<i32>(0i, 0i, 0i)));
  x_155 = x_149;
  if (!(x_149)) {
    x_154 = any((p >= grid_dims));
    x_155 = x_154;
  }
  return x_155;
}

fn grid_iterator_get_cell_struct_GridIterator_vi3_vi3_vf3_vi3_vf3_f11_vf2_vi3_(iter : ptr<function, GridIterator>, cell_t_range : ptr<function, vec2<f32>>, cell_id : ptr<function, vec3<i32>>) -> bool {
  let x_227 : vec3<i32> = (*(iter)).cell;
  let x_229 : vec3<i32> = (*(iter)).grid_dims;
  let x_230 : bool = outside_grid_vi3_vi3_(x_227, x_229);
  if (x_230) {
    return false;
  }
  let x_236 : f32 = (*(iter)).t;
  (*(cell_t_range)).x = x_236;
  let x_240 : f32 = (*(iter)).t_max.x;
  let x_243 : f32 = (*(iter)).t_max.y;
  let x_245 : f32 = (*(iter)).t_max.z;
  (*(cell_t_range)).y = min(x_240, min(x_243, x_245));
  let x_250 : vec3<i32> = (*(iter)).cell;
  *(cell_id) = x_250;
  let x_252 : f32 = (*(cell_t_range)).y;
  let x_254 : f32 = (*(cell_t_range)).x;
  if ((x_252 < x_254)) {
    return false;
  }
  return true;
}

fn compute_vertex_values_vu3_vu3_f1_8__vf2_(voxel_pos_1 : ptr<function, vec3<u32>>, block_dims_1 : ptr<function, vec3<u32>>, values : ptr<function, array<f32, 8u>>, value_range : ptr<function, vec2<f32>>) {
  var i : i32;
  var v : vec3<u32>;
  var indexable : array<vec3<i32>, 8u>;
  var voxel : u32;
  (*(value_range)).x = 100000002004087734272.0f;
  (*(value_range)).y = -100000002004087734272.0f;
  i = 0i;
  loop {
    let x_508 : i32 = i;
    if ((x_508 < 8i)) {
    } else {
      break;
    }
    let x_520 : i32 = i;
    indexable = array<vec3<i32>, 8u>(vec3<i32>(0i, 0i, 0i), vec3<i32>(1i, 0i, 0i), vec3<i32>(0i, 1i, 0i), vec3<i32>(1i, 1i, 0i), vec3<i32>(0i, 0i, 1i), vec3<i32>(1i, 0i, 1i), vec3<i32>(0i, 1i, 1i), vec3<i32>(1i, 1i, 1i));
    let x_524 : vec3<i32> = indexable[x_520];
    v = bitcast<vec3<u32>>(x_524);
    let x_528 : u32 = (*(voxel_pos_1)).z;
    let x_530 : u32 = v.z;
    let x_533 : u32 = (*(block_dims_1)).y;
    let x_536 : u32 = (*(voxel_pos_1)).y;
    let x_539 : u32 = v.y;
    let x_542 : u32 = (*(block_dims_1)).x;
    let x_545 : u32 = (*(voxel_pos_1)).x;
    let x_548 : u32 = v.x;
    voxel = (((((((x_528 + x_530) * x_533) + x_536) + x_539) * x_542) + x_545) + x_548);
    let x_550 : i32 = i;
    let x_555 : u32 = voxel;
    let x_558 : f32 = volume_block[x_555];
    (*(values))[x_550] = x_558;
    let x_561 : f32 = (*(value_range)).x;
    let x_562 : i32 = i;
    let x_564 : f32 = (*(values))[x_562];
    (*(value_range)).x = min(x_561, x_564);
    let x_568 : f32 = (*(value_range)).y;
    let x_569 : i32 = i;
    let x_571 : f32 = (*(values))[x_569];
    (*(value_range)).y = max(x_568, x_571);

    continuing {
      let x_574 : i32 = i;
      i = (x_574 + 1i);
    }
  }
  return;
}

fn compute_polynomial_vf3_vf3_vf3_f1_8__(p_1 : vec3<f32>, dir_1 : vec3<f32>, v000 : vec3<f32>, values_1 : ptr<function, array<f32, 8u>>) -> vec4<f32> {
  var v111 : vec3<f32>;
  var a : array<vec3<f32>, 2u>;
  var b_1 : array<vec3<f32>, 2u>;
  var poly_2 : vec4<f32>;
  var k : i32;
  var j : i32;
  var i_3 : i32;
  var val : f32;
  v111 = (v000 + vec3<f32>(1.0f, 1.0f, 1.0f));
  let x_1006 : vec3<f32> = v111;
  a = array<vec3<f32>, 2u>((x_1006 - p_1), (p_1 - v000));
  b_1 = array<vec3<f32>, 2u>(-(dir_1), dir_1);
  poly_2 = vec4<f32>(0.0f, 0.0f, 0.0f, 0.0f);
  k = 0i;
  loop {
    let x_1022 : i32 = k;
    if ((x_1022 < 2i)) {
    } else {
      break;
    }
    j = 0i;
    loop {
      let x_1030 : i32 = j;
      if ((x_1030 < 2i)) {
      } else {
        break;
      }
      i_3 = 0i;
      loop {
        let x_1038 : i32 = i_3;
        if ((x_1038 < 2i)) {
        } else {
          break;
        }
        let x_1041 : i32 = i_3;
        let x_1042 : i32 = j;
        let x_1043 : i32 = k;
        let x_1049 : f32 = (*(values_1))[(x_1041 + (2i * (x_1042 + (2i * x_1043))))];
        val = x_1049;
        let x_1050 : i32 = i_3;
        let x_1052 : f32 = b_1[x_1050].x;
        let x_1053 : i32 = j;
        let x_1055 : f32 = b_1[x_1053].y;
        let x_1057 : i32 = k;
        let x_1059 : f32 = b_1[x_1057].z;
        let x_1061 : f32 = val;
        let x_1064 : f32 = poly_2.x;
        poly_2.x = (x_1064 + (((x_1052 * x_1055) * x_1059) * x_1061));
        let x_1067 : i32 = i_3;
        let x_1069 : f32 = a[x_1067].x;
        let x_1070 : i32 = j;
        let x_1072 : f32 = b_1[x_1070].y;
        let x_1074 : i32 = k;
        let x_1076 : f32 = b_1[x_1074].z;
        let x_1078 : i32 = i_3;
        let x_1080 : f32 = b_1[x_1078].x;
        let x_1081 : i32 = j;
        let x_1083 : f32 = a[x_1081].y;
        let x_1085 : i32 = k;
        let x_1087 : f32 = b_1[x_1085].z;
        let x_1090 : i32 = i_3;
        let x_1092 : f32 = b_1[x_1090].x;
        let x_1093 : i32 = j;
        let x_1095 : f32 = b_1[x_1093].y;
        let x_1097 : i32 = k;
        let x_1099 : f32 = a[x_1097].z;
        let x_1102 : f32 = val;
        let x_1105 : f32 = poly_2.y;
        poly_2.y = (x_1105 + (((((x_1069 * x_1072) * x_1076) + ((x_1080 * x_1083) * x_1087)) + ((x_1092 * x_1095) * x_1099)) * x_1102));
        let x_1108 : i32 = i_3;
        let x_1110 : f32 = b_1[x_1108].x;
        let x_1111 : i32 = j;
        let x_1113 : f32 = a[x_1111].y;
        let x_1115 : i32 = k;
        let x_1117 : f32 = a[x_1115].z;
        let x_1119 : i32 = i_3;
        let x_1121 : f32 = a[x_1119].x;
        let x_1122 : i32 = j;
        let x_1124 : f32 = b_1[x_1122].y;
        let x_1126 : i32 = k;
        let x_1128 : f32 = a[x_1126].z;
        let x_1131 : i32 = i_3;
        let x_1133 : f32 = a[x_1131].x;
        let x_1134 : i32 = j;
        let x_1136 : f32 = a[x_1134].y;
        let x_1138 : i32 = k;
        let x_1140 : f32 = b_1[x_1138].z;
        let x_1143 : f32 = val;
        let x_1146 : f32 = poly_2.z;
        poly_2.z = (x_1146 + (((((x_1110 * x_1113) * x_1117) + ((x_1121 * x_1124) * x_1128)) + ((x_1133 * x_1136) * x_1140)) * x_1143));
        let x_1149 : i32 = i_3;
        let x_1151 : f32 = a[x_1149].x;
        let x_1152 : i32 = j;
        let x_1154 : f32 = a[x_1152].y;
        let x_1156 : i32 = k;
        let x_1158 : f32 = a[x_1156].z;
        let x_1160 : f32 = val;
        let x_1163 : f32 = poly_2.w;
        poly_2.w = (x_1163 + (((x_1151 * x_1154) * x_1158) * x_1160));

        continuing {
          let x_1166 : i32 = i_3;
          i_3 = (x_1166 + 1i);
        }
      }

      continuing {
        let x_1168 : i32 = j;
        j = (x_1168 + 1i);
      }
    }

    continuing {
      let x_1170 : i32 = k;
      k = (x_1170 + 1i);
    }
  }
  let x_1172 : vec4<f32> = poly_2;
  return x_1172;
}

fn evaluate_polynomial_vf4_f1_(poly : vec4<f32>, t_1 : f32) -> f32 {
  return ((((poly.x * pow(t_1, 3.0f)) + (poly.y * pow(t_1, 2.0f))) + (poly.z * t_1)) + poly.w);
}

fn solve_quadratic_vf3_f1_2__(poly_1 : vec3<f32>, roots : ptr<function, array<f32, 2u>>) -> bool {
  var discriminant : f32;
  var r : vec2<f32>;
  if ((poly_1.x == 0.0f)) {
    (*(roots))[0i] = (-(poly_1.z) / poly_1.y);
    (*(roots))[1i] = (-(poly_1.z) / poly_1.y);
    return true;
  }
  discriminant = (pow(poly_1.y, 2.0f) - ((4.0f * poly_1.x) * poly_1.z));
  let x_1215 : f32 = discriminant;
  if ((x_1215 < 0.0f)) {
    return false;
  }
  let x_1220 : f32 = discriminant;
  discriminant = sqrt(x_1220);
  let x_1226 : f32 = discriminant;
  let x_1230 : f32 = discriminant;
  let x_1234 : f32 = poly_1.x;
  r = ((vec2<f32>((-(poly_1.y) + x_1226), (-(poly_1.y) - x_1230)) * 0.5f) / vec2<f32>(x_1234, x_1234));
  let x_1238 : f32 = r.x;
  let x_1240 : f32 = r.y;
  (*(roots))[0i] = min(x_1238, x_1240);
  let x_1244 : f32 = r.x;
  let x_1246 : f32 = r.y;
  (*(roots))[1i] = max(x_1244, x_1246);
  return true;
}

fn marmitt_intersect_vf3_vf3_vf3_f1_8__f1_f1_f1_(vol_eye : vec3<f32>, grid_ray_dir : vec3<f32>, v000_2 : vec3<f32>, vertex_values_1 : array<f32, 8u>, t_prev : f32, t_next : f32, t_hit : ptr<function, f32>) -> bool {
  var cell_p : vec3<f32>;
  var t_in : f32;
  var t_out : f32;
  var cell_ray_dir : vec3<f32>;
  var poly_3 : vec4<f32>;
  var param_16 : array<f32, 8u>;
  var f_in : f32;
  var f_out : f32;
  var roots_1 : array<f32, 2u>;
  var param_17 : array<f32, 2u>;
  var f_root0 : f32;
  var f_root1 : f32;
  var cell_t_hit : f32;
  var hit_p_1 : vec3<f32>;
  if ((t_next <= t_prev)) {
    return false;
  }
  var x_1462 : bool;
  var x_1463 : bool;
  var x_1494 : bool;
  var x_1495 : bool;
  cell_p = (vol_eye + (grid_ray_dir * (t_prev + ((t_next - t_prev) * 0.5f))));
  t_in = ((-((t_next - t_prev)) * 0.5f) * length(grid_ray_dir));
  t_out = (((t_next - t_prev) * 0.5f) * length(grid_ray_dir));
  cell_ray_dir = normalize(grid_ray_dir);
  let x_1419 : vec3<f32> = cell_p;
  let x_1420 : vec3<f32> = cell_ray_dir;
  param_16 = vertex_values_1;
  let x_1422 : vec4<f32> = compute_polynomial_vf3_vf3_vf3_f1_8__(x_1419, x_1420, v000_2, &(param_16));
  poly_3 = x_1422;
  let x_1424 : f32 = x_409.isovalue;
  let x_1426 : f32 = poly_3.w;
  poly_3.w = (x_1426 - x_1424);
  let x_1430 : vec4<f32> = poly_3;
  let x_1431 : f32 = t_in;
  let x_1432 : f32 = evaluate_polynomial_vf4_f1_(x_1430, x_1431);
  f_in = x_1432;
  let x_1434 : vec4<f32> = poly_3;
  let x_1435 : f32 = t_out;
  let x_1436 : f32 = evaluate_polynomial_vf4_f1_(x_1434, x_1435);
  f_out = x_1436;
  roots_1 = array<f32, 2u>(0.0f, 0.0f);
  let x_1440 : f32 = poly_3.x;
  let x_1443 : f32 = poly_3.y;
  let x_1446 : f32 = poly_3.z;
  let x_1449 : bool = solve_quadratic_vf3_f1_2__(vec3<f32>((3.0f * x_1440), (2.0f * x_1443), x_1446), &(param_17));
  let x_1450 : array<f32, 2u> = param_17;
  roots_1 = x_1450;
  if (x_1449) {
    let x_1454 : f32 = roots_1[0i];
    let x_1455 : f32 = t_in;
    let x_1456 : bool = (x_1454 >= x_1455);
    x_1463 = x_1456;
    if (x_1456) {
      let x_1460 : f32 = roots_1[0i];
      let x_1461 : f32 = t_out;
      x_1462 = (x_1460 <= x_1461);
      x_1463 = x_1462;
    }
    if (x_1463) {
      let x_1467 : vec4<f32> = poly_3;
      let x_1469 : f32 = roots_1[0i];
      let x_1470 : f32 = evaluate_polynomial_vf4_f1_(x_1467, x_1469);
      f_root0 = x_1470;
      let x_1471 : f32 = f_root0;
      let x_1473 : f32 = f_in;
      if ((sign(x_1471) == sign(x_1473))) {
        let x_1479 : f32 = roots_1[0i];
        t_in = x_1479;
        let x_1480 : f32 = f_root0;
        f_in = x_1480;
      } else {
        let x_1483 : f32 = roots_1[0i];
        t_out = x_1483;
        let x_1484 : f32 = f_root0;
        f_out = x_1484;
      }
    }
    let x_1486 : f32 = roots_1[1i];
    let x_1487 : f32 = t_in;
    let x_1488 : bool = (x_1486 >= x_1487);
    x_1495 = x_1488;
    if (x_1488) {
      let x_1492 : f32 = roots_1[1i];
      let x_1493 : f32 = t_out;
      x_1494 = (x_1492 <= x_1493);
      x_1495 = x_1494;
    }
    if (x_1495) {
      let x_1499 : vec4<f32> = poly_3;
      let x_1501 : f32 = roots_1[1i];
      let x_1502 : f32 = evaluate_polynomial_vf4_f1_(x_1499, x_1501);
      f_root1 = x_1502;
      let x_1503 : f32 = f_root1;
      let x_1505 : f32 = f_in;
      if ((sign(x_1503) == sign(x_1505))) {
        let x_1511 : f32 = roots_1[1i];
        t_in = x_1511;
        let x_1512 : f32 = f_root1;
        f_in = x_1512;
      } else {
        let x_1515 : f32 = roots_1[1i];
        t_out = x_1515;
        let x_1516 : f32 = f_root1;
        f_out = x_1516;
      }
    }
  }
  let x_1517 : f32 = f_in;
  let x_1519 : f32 = f_out;
  if (!((sign(x_1517) == sign(x_1519)))) {
    let x_1525 : f32 = t_in;
    let x_1526 : f32 = t_out;
    let x_1527 : f32 = t_in;
    let x_1529 : f32 = f_in;
    let x_1532 : f32 = f_out;
    let x_1533 : f32 = f_in;
    cell_t_hit = (x_1525 + (((x_1526 - x_1527) * -(x_1529)) / (x_1532 - x_1533)));
    let x_1538 : vec3<f32> = cell_p;
    let x_1539 : vec3<f32> = cell_ray_dir;
    let x_1540 : f32 = cell_t_hit;
    hit_p_1 = (x_1538 + (x_1539 * x_1540));
    let x_1543 : vec3<f32> = hit_p_1;
    *(t_hit) = (length((x_1543 - vol_eye)) / length(grid_ray_dir));
    return true;
  }
  return false;
}

fn grid_iterator_advance_struct_GridIterator_vi3_vi3_vf3_vi3_vf3_f11_(iter_1 : ptr<function, GridIterator>) {
  let x_263 : f32 = (*(iter_1)).t_max.x;
  let x_265 : f32 = (*(iter_1)).t_max.y;
  let x_267 : f32 = (*(iter_1)).t_max.z;
  (*(iter_1)).t = min(x_263, min(x_265, x_267));
  let x_272 : f32 = (*(iter_1)).t;
  let x_274 : f32 = (*(iter_1)).t_max.x;
  if ((x_272 == x_274)) {
    let x_280 : i32 = (*(iter_1)).grid_step.x;
    let x_282 : i32 = (*(iter_1)).cell.x;
    (*(iter_1)).cell.x = (x_282 + x_280);
    let x_286 : f32 = (*(iter_1)).t_delta.x;
    let x_288 : f32 = (*(iter_1)).t_max.x;
    (*(iter_1)).t_max.x = (x_288 + x_286);
  } else {
    let x_293 : f32 = (*(iter_1)).t;
    let x_295 : f32 = (*(iter_1)).t_max.y;
    if ((x_293 == x_295)) {
      let x_300 : i32 = (*(iter_1)).grid_step.y;
      let x_302 : i32 = (*(iter_1)).cell.y;
      (*(iter_1)).cell.y = (x_302 + x_300);
      let x_306 : f32 = (*(iter_1)).t_delta.y;
      let x_308 : f32 = (*(iter_1)).t_max.y;
      (*(iter_1)).t_max.y = (x_308 + x_306);
    } else {
      let x_313 : i32 = (*(iter_1)).grid_step.z;
      let x_315 : i32 = (*(iter_1)).cell.z;
      (*(iter_1)).cell.z = (x_315 + x_313);
      let x_319 : f32 = (*(iter_1)).t_delta.z;
      let x_321 : f32 = (*(iter_1)).t_max.z;
      (*(iter_1)).t_max.z = (x_321 + x_319);
    }
  }
  return;
}

fn compute_normal_vi3_vf3_f1_8__(v000_1 : vec3<i32>, hit_p : vec3<f32>, vertex_values : array<f32, 8u>) -> vec3<f32> {
  var N_1 : vec3<f32>;
  var v111_1 : vec3<f32>;
  var a_1 : array<vec3<f32>, 2u>;
  var k_1 : i32;
  var j_1 : i32;
  var i_4 : i32;
  var val_1 : f32;
  var indexable_12 : array<f32, 8u>;
  var indexable_13 : array<f32, 2u>;
  var indexable_14 : array<f32, 2u>;
  var indexable_15 : array<f32, 2u>;
  N_1 = vec3<f32>(0.0f, 0.0f, 0.0f);
  v111_1 = (vec3<f32>(v000_1) + vec3<f32>(1.0f, 1.0f, 1.0f));
  let x_1289 : vec3<f32> = v111_1;
  a_1 = array<vec3<f32>, 2u>((x_1289 - hit_p), (hit_p - vec3<f32>(v000_1)));
  k_1 = 0i;
  loop {
    let x_1300 : i32 = k_1;
    if ((x_1300 < 2i)) {
    } else {
      break;
    }
    j_1 = 0i;
    loop {
      let x_1308 : i32 = j_1;
      if ((x_1308 < 2i)) {
      } else {
        break;
      }
      i_4 = 0i;
      loop {
        let x_1316 : i32 = i_4;
        if ((x_1316 < 2i)) {
        } else {
          break;
        }
        let x_1319 : i32 = i_4;
        let x_1320 : i32 = j_1;
        let x_1321 : i32 = k_1;
        indexable_12 = vertex_values;
        let x_1328 : f32 = indexable_12[(x_1319 + (2i * (x_1320 + (2i * x_1321))))];
        val_1 = x_1328;
        let x_1331 : i32 = i_4;
        indexable_13 = array<f32, 2u>(-1.0f, 1.0f);
        let x_1334 : f32 = indexable_13[x_1331];
        let x_1335 : i32 = j_1;
        let x_1337 : f32 = a_1[x_1335].y;
        let x_1339 : i32 = k_1;
        let x_1341 : f32 = a_1[x_1339].z;
        let x_1343 : f32 = val_1;
        let x_1346 : f32 = N_1.x;
        N_1.x = (x_1346 + (((x_1334 * x_1337) * x_1341) * x_1343));
        let x_1349 : i32 = j_1;
        indexable_14 = array<f32, 2u>(-1.0f, 1.0f);
        let x_1352 : f32 = indexable_14[x_1349];
        let x_1353 : i32 = i_4;
        let x_1355 : f32 = a_1[x_1353].x;
        let x_1357 : i32 = k_1;
        let x_1359 : f32 = a_1[x_1357].z;
        let x_1361 : f32 = val_1;
        let x_1364 : f32 = N_1.y;
        N_1.y = (x_1364 + (((x_1352 * x_1355) * x_1359) * x_1361));
        let x_1367 : i32 = k_1;
        indexable_15 = array<f32, 2u>(-1.0f, 1.0f);
        let x_1370 : f32 = indexable_15[x_1367];
        let x_1371 : i32 = i_4;
        let x_1373 : f32 = a_1[x_1371].x;
        let x_1375 : i32 = j_1;
        let x_1377 : f32 = a_1[x_1375].y;
        let x_1379 : f32 = val_1;
        let x_1382 : f32 = N_1.z;
        N_1.z = (x_1382 + (((x_1370 * x_1373) * x_1377) * x_1379));

        continuing {
          let x_1385 : i32 = i_4;
          i_4 = (x_1385 + 1i);
        }
      }

      continuing {
        let x_1387 : i32 = j_1;
        j_1 = (x_1387 + 1i);
      }
    }

    continuing {
      let x_1389 : i32 = k_1;
      k_1 = (x_1389 + 1i);
    }
  }
  let x_1391 : vec3<f32> = N_1;
  return normalize(x_1391);
}

fn shading_vf3_vf3_vf3_vf3_(N : ptr<function, vec3<f32>>, V : ptr<function, vec3<f32>>, L : ptr<function, vec3<f32>>, base_color : ptr<function, vec3<f32>>) -> vec3<f32> {
  var H : vec3<f32>;
  var c_1 : vec3<f32>;
  let x_1252 : vec3<f32> = *(V);
  let x_1253 : vec3<f32> = *(L);
  H = normalize((x_1252 + x_1253));
  let x_1257 : vec3<f32> = *(base_color);
  c_1 = (x_1257 * 0.200000003f);
  let x_1261 : vec3<f32> = *(L);
  let x_1262 : vec3<f32> = *(N);
  let x_1266 : vec3<f32> = *(base_color);
  let x_1268 : vec3<f32> = c_1;
  c_1 = (x_1268 + (x_1266 * (0.600000024f * clamp(dot(x_1261, x_1262), 0.0f, 1.0f))));
  let x_1271 : vec3<f32> = H;
  let x_1272 : vec3<f32> = *(N);
  let x_1277 : f32 = (0.100000001f * pow(clamp(dot(x_1271, x_1272), 0.0f, 1.0f), 5.0f));
  let x_1278 : vec3<f32> = c_1;
  c_1 = (x_1278 + vec3<f32>(x_1277, x_1277, x_1277));
  let x_1281 : vec3<f32> = c_1;
  return x_1281;
}

fn pack_color_vf3_(rgb : ptr<function, vec3<f32>>) -> i32 {
  var rbg256 : vec3<i32>;
  var c : i32;
  let x_370 : vec3<f32> = *(rgb);
  rbg256 = clamp(vec3<i32>((x_370 * 255.0f)), vec3<i32>(0i, 0i, 0i), vec3<i32>(255i, 255i, 255i));
  c = 0i;
  let x_379 : i32 = rbg256.x;
  let x_384 : i32 = c;
  c = (x_384 | ((x_379 << bitcast<u32>(24i)) & -16777216i));
  let x_387 : i32 = rbg256.y;
  let x_392 : i32 = c;
  c = (x_392 | ((x_387 << bitcast<u32>(16i)) & 16711680i));
  let x_395 : i32 = rbg256.z;
  let x_400 : i32 = c;
  c = (x_400 | ((x_395 << bitcast<u32>(8i)) & 65280i));
  let x_402 : i32 = c;
  return x_402;
}

fn main_1() {
  var block_dims_5 : vec3<u32>;
  var n_blocks_4 : vec3<u32>;
  var block_pos_3 : vec3<u32>;
  var param_18 : u32;
  var volume_translation : vec3<f32>;
  var transformed_eye : vec3<f32>;
  var vol_eye_1 : vec3<f32>;
  var chunks : u32;
  var i_5 : u32;
  var pixel_coords : vec2<i32>;
  var color : vec4<f32>;
  var ray_id : u32;
  var ray_index : u32;
  var param_19 : u32;
  var spec_index : u32;
  var grid_ray_dir_1 : vec3<f32>;
  var hit_surface : bool;
  var hit_p_2 : vec3<f32>;
  var cell_range : vec2<f32>;
  var brick_range : vec2<f32>;
  var param_20 : vec3<f32>;
  var param_21 : vec3<f32>;
  var grid_iter_1 : GridIterator;
  var param_22 : vec3<f32>;
  var param_23 : vec3<f32>;
  var param_24 : f32;
  var param_25 : vec3<i32>;
  var v000_3 : vec3<i32>;
  var cell_t_range_1 : vec2<f32>;
  var param_26 : GridIterator;
  var param_27 : vec2<f32>;
  var param_28 : vec3<i32>;
  var vertex_values_2 : array<f32, 8u>;
  var param_29 : vec3<u32>;
  var param_30 : vec3<u32>;
  var param_31 : array<f32, 8u>;
  var param_32 : vec2<f32>;
  var skip_cell : bool;
  var t_hit_1 : f32;
  var param_33 : f32;
  var param_34 : GridIterator;
  var N_2 : vec3<f32>;
  var L_1 : vec3<f32>;
  var V_1 : vec3<f32>;
  var param_35 : vec3<f32>;
  var param_36 : vec3<f32>;
  var param_37 : vec3<f32>;
  var param_38 : vec3<f32>;
  var param_39 : vec3<f32>;
  let x_1552 : u32 = gl_LocalInvocationID.x;
  if ((x_1552 == 0u)) {
    let x_1566 : u32 = gl_WorkGroupID.x;
    let x_1571 : u32 = x_1569.id_offset;
    let x_1575 : BlockInfo_1 = x_1563.blocks[(x_1566 + x_1571)];
    block_info.id = x_1575.id;
    block_info.ray_offset = x_1575.ray_offset;
    block_info.num_rays = x_1575.num_rays;
    block_info.lod = x_1575.lod;
  }
  workgroupBarrier();
  let x_1587 : u32 = block_info.id;
  let x_1588 : vec3<u32> = load_block_u1_(x_1587);
  block_dims_5 = x_1588;
  let x_1590 : u32 = gl_WorkGroupID.x;
  let x_1592 : u32 = x_1569.id_offset;
  let x_1595 : u32 = x_1569.total_active_blocks;
  if (((x_1590 + x_1592) >= x_1595)) {
    return;
  }
  let x_1601 : u32 = block_info.num_rays;
  if ((x_1601 == 0u)) {
    return;
  }
  let x_1608 : vec4<u32> = x_409.padded_dims;
  n_blocks_4 = (vec3<u32>(x_1608.x, x_1608.y, x_1608.z) / vec3<u32>(4u, 4u, 4u));
  let x_1614 : u32 = block_info.id;
  param_18 = x_1614;
  let x_1615 : vec3<u32> = block_id_to_pos_u1_(&(param_18));
  block_pos_3 = (x_1615 * vec3<u32>(4u, 4u, 4u));
  let x_1621 : vec4<f32> = x_409.volume_scale;
  volume_translation = (vec3<f32>(0.0f, 0.0f, 0.0f) - (vec3<f32>(x_1621.x, x_1621.y, x_1621.z) * 0.5f));
  let x_1631 : vec4<f32> = x_1629.eye_pos;
  let x_1633 : vec3<f32> = volume_translation;
  let x_1636 : vec4<f32> = x_409.volume_scale;
  transformed_eye = ((vec3<f32>(x_1631.x, x_1631.y, x_1631.z) - x_1633) / vec3<f32>(x_1636.x, x_1636.y, x_1636.z));
  let x_1640 : vec3<f32> = transformed_eye;
  let x_1642 : vec4<u32> = x_409.volume_dims;
  let x_1648 : vec3<u32> = block_pos_3;
  vol_eye_1 = (((x_1640 * vec3<f32>(vec3<u32>(x_1642.x, x_1642.y, x_1642.z))) - vec3<f32>(0.5f, 0.5f, 0.5f)) - vec3<f32>(x_1648));
  let x_1653 : u32 = block_info.num_rays;
  chunks = (x_1653 / 64u);
  let x_1656 : u32 = block_info.num_rays;
  if (((x_1656 % 64u) != 0u)) {
    let x_1661 : u32 = chunks;
    chunks = (x_1661 + bitcast<u32>(1i));
  }
  i_5 = 0u;
  loop {
    let x_1669 : u32 = i_5;
    let x_1670 : u32 = chunks;
    if ((x_1669 < x_1670)) {
    } else {
      break;
    }
    pixel_coords = vec2<i32>(-1i, -1i);
    color = vec4<f32>(1.0f, 1.0f, 1.0f, 1.0f);
    color.w = 1.0f;
    let x_1680 : u32 = i_5;
    let x_1683 : u32 = gl_LocalInvocationID.x;
    ray_id = ((x_1680 * 64u) + x_1683);
    let x_1685 : u32 = ray_id;
    let x_1687 : u32 = block_info.num_rays;
    if ((x_1685 < x_1687)) {
      let x_1697 : u32 = block_info.ray_offset;
      let x_1698 : u32 = ray_id;
      let x_1701 : u32 = x_1695.ray_ids[(x_1697 + x_1698)];
      ray_index = x_1701;
      let x_1703 : u32 = ray_index;
      param_19 = x_1703;
      let x_1704 : vec2<u32> = ray_id_to_pos_u1_(&(param_19));
      pixel_coords = bitcast<vec2<i32>>(x_1704);
      let x_1712 : u32 = block_info.ray_offset;
      let x_1713 : u32 = ray_id;
      let x_1716 : u32 = x_1710.spec_ids[(x_1712 + x_1713)];
      spec_index = x_1716;
      let x_1723 : u32 = ray_index;
      let x_1726 : vec3<f32> = x_1722.rays[x_1723].ray_dir;
      grid_ray_dir_1 = x_1726;
      hit_surface = false;
      hit_p_2 = vec3<f32>(0.0f, 0.0f, 0.0f);
      cell_range = vec2<f32>(0.0f, 0.0f);
      let x_1735 : vec3<f32> = vol_eye_1;
      param_20 = x_1735;
      let x_1737 : vec3<f32> = grid_ray_dir_1;
      param_21 = x_1737;
      let x_1738 : vec2<f32> = intersect_box_vf3_vf3_vf3_vf3_(&(param_20), &(param_21), vec3<f32>(0.0f, 0.0f, 0.0f), vec3<f32>(4.0f, 4.0f, 4.0f));
      brick_range = x_1738;
      let x_1740 : f32 = brick_range.y;
      let x_1742 : f32 = brick_range.x;
      if ((x_1740 <= x_1742)) {
        continue;
      }
      let x_1749 : f32 = brick_range.x;
      let x_1752 : vec3<u32> = block_dims_5;
      let x_1757 : vec3<f32> = vol_eye_1;
      param_22 = x_1757;
      let x_1759 : vec3<f32> = grid_ray_dir_1;
      param_23 = x_1759;
      param_24 = (x_1749 - 0.001f);
      param_25 = (bitcast<vec3<i32>>(x_1752) - vec3<i32>(1i, 1i, 1i));
      let x_1762 : GridIterator = init_grid_iterator_vf3_vf3_f1_vi3_(&(param_22), &(param_23), &(param_24), &(param_25));
      grid_iter_1 = x_1762;
      v000_3 = vec3<i32>(0i, 0i, 0i);
      loop {
        var x_1802 : bool;
        var x_1803 : bool;
        let x_1771 : GridIterator = grid_iter_1;
        param_26 = x_1771;
        let x_1774 : bool = grid_iterator_get_cell_struct_GridIterator_vi3_vi3_vf3_vi3_vf3_f11_vf2_vi3_(&(param_26), &(param_27), &(param_28));
        let x_1775 : GridIterator = param_26;
        grid_iter_1 = x_1775;
        let x_1776 : vec2<f32> = param_27;
        cell_t_range_1 = x_1776;
        let x_1777 : vec3<i32> = param_28;
        v000_3 = x_1777;
        if (x_1774) {
        } else {
          break;
        }
        let x_1778 : vec3<i32> = v000_3;
        param_29 = bitcast<vec3<u32>>(x_1778);
        let x_1783 : vec3<u32> = block_dims_5;
        param_30 = x_1783;
        compute_vertex_values_vu3_vu3_f1_8__vf2_(&(param_29), &(param_30), &(param_31), &(param_32));
        let x_1787 : array<f32, 8u> = param_31;
        vertex_values_2 = x_1787;
        let x_1788 : vec2<f32> = param_32;
        cell_range = x_1788;
        let x_1791 : f32 = x_409.isovalue;
        let x_1793 : f32 = cell_range.x;
        let x_1794 : bool = (x_1791 < x_1793);
        x_1803 = x_1794;
        if (!(x_1794)) {
          let x_1799 : f32 = x_409.isovalue;
          let x_1801 : f32 = cell_range.y;
          x_1802 = (x_1799 > x_1801);
          x_1803 = x_1802;
        }
        skip_cell = x_1803;
        let x_1804 : bool = skip_cell;
        if (!(x_1804)) {
          let x_1808 : vec3<f32> = vol_eye_1;
          let x_1809 : vec3<f32> = grid_ray_dir_1;
          let x_1810 : vec3<i32> = v000_3;
          let x_1812 : array<f32, 8u> = vertex_values_2;
          let x_1814 : f32 = cell_t_range_1.x;
          let x_1816 : f32 = cell_t_range_1.y;
          let x_1819 : bool = marmitt_intersect_vf3_vf3_vf3_f1_8__f1_f1_f1_(x_1808, x_1809, vec3<f32>(x_1810), x_1812, x_1814, x_1816, &(param_33));
          let x_1820 : f32 = param_33;
          t_hit_1 = x_1820;
          hit_surface = x_1819;
          let x_1821 : bool = hit_surface;
          if (x_1821) {
            let x_1824 : vec3<f32> = vol_eye_1;
            let x_1825 : vec3<f32> = grid_ray_dir_1;
            let x_1826 : f32 = t_hit_1;
            hit_p_2 = (x_1824 + (x_1825 * x_1826));
            break;
          }
        }
        let x_1831 : GridIterator = grid_iter_1;
        param_34 = x_1831;
        grid_iterator_advance_struct_GridIterator_vi3_vi3_vf3_vi3_vf3_f11_(&(param_34));
        let x_1833 : GridIterator = param_34;
        grid_iter_1 = x_1833;
      }
      let x_1834 : bool = hit_surface;
      if (x_1834) {
        let x_1837 : u32 = ray_index;
        x_1722.rays[x_1837].t = 340282346638528859811704183484516925440.0f;
        let x_1841 : vec3<i32> = v000_3;
        let x_1842 : vec3<f32> = hit_p_2;
        let x_1843 : array<f32, 8u> = vertex_values_2;
        let x_1844 : vec3<f32> = compute_normal_vi3_vf3_f1_8__(x_1841, x_1842, x_1843);
        N_2 = x_1844;
        let x_1846 : vec3<f32> = grid_ray_dir_1;
        L_1 = normalize(-(x_1846));
        let x_1850 : vec3<f32> = grid_ray_dir_1;
        V_1 = normalize(-(x_1850));
        let x_1853 : vec3<f32> = N_2;
        let x_1854 : vec3<f32> = grid_ray_dir_1;
        if ((dot(x_1853, x_1854) > 0.0f)) {
          let x_1859 : vec3<f32> = N_2;
          N_2 = -(x_1859);
        }
        let x_1865 : vec3<f32> = N_2;
        param_35 = x_1865;
        let x_1867 : vec3<f32> = L_1;
        param_36 = x_1867;
        let x_1869 : vec3<f32> = V_1;
        param_37 = x_1869;
        param_38 = vec3<f32>(0.300000012f, 0.300000012f, 0.899999976f);
        let x_1871 : vec3<f32> = shading_vf3_vf3_vf3_vf3_(&(param_35), &(param_36), &(param_37), &(param_38));
        let x_1872 : vec4<f32> = color;
        color = vec4<f32>(x_1871.x, x_1871.y, x_1871.z, x_1872.w);
        let x_1878 : u32 = spec_index;
        let x_1880 : vec4<f32> = color;
        param_39 = vec3<f32>(x_1880.x, x_1880.y, x_1880.z);
        let x_1882 : i32 = pack_color_vf3_(&(param_39));
        let x_1884 : f32 = t_hit_1;
        x_1877.ray_rgbz[x_1878] = vec2<f32>(bitcast<f32>(x_1882), x_1884);
      }
    }

    continuing {
      let x_1888 : u32 = i_5;
      i_5 = (x_1888 + bitcast<u32>(1i));
    }
  }
  return;
}

@compute @workgroup_size(64i, 1i, 1i)
fn main(@builtin(local_invocation_id) gl_LocalInvocationID_param : vec3<u32>, @builtin(workgroup_id) gl_WorkGroupID_param : vec3<u32>) {
  gl_LocalInvocationID = gl_LocalInvocationID_param;
  gl_WorkGroupID = gl_WorkGroupID_param;
  main_1();
}
`;

export const compute_voxel_range_comp_spv = `struct BlockIDOffset {
  block_id_offset : u32,
}

struct VolumeParams {
  volume_dims : vec4<u32>,
  padded_dims : vec4<u32>,
  volume_scale : vec4<f32>,
  max_bits : u32,
  isovalue : f32,
  image_width : u32,
}

alias RTArr = array<vec2<f32>>;

alias RTArr_1 = array<vec2<f32>>;

struct BlockInformation {
  block_ranges : RTArr_1,
}

struct VoxelInformation {
  voxel_ranges : RTArr_1,
}

struct EmulateUint64 {
  lo : u32,
  hi : u32,
}

alias RTArr_2 = array<EmulateUint64>;

struct Compressed {
  compressed : RTArr_2,
}

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(1) @binding(0) var<uniform> x_18 : BlockIDOffset;

@group(0) @binding(1) var<uniform> x_33 : VolumeParams;

@group(0) @binding(2) var<storage, read_write> x_91 : BlockInformation;

@group(2) @binding(0) var<storage, read_write> x_197 : VoxelInformation;

@group(0) @binding(0) var<storage, read_write> x_206 : Compressed;

fn main_1() {
  var block_index : u32;
  var total_blocks : u32;
  var n_blocks : vec3<u32>;
  var block_pos : vec3<u32>;
  var cell_range : vec2<f32>;
  var k : i32;
  var j : i32;
  var i : i32;
  var neighbor : vec3<u32>;
  var coords : vec3<u32>;
  var neighbor_id : u32;
  let x_15 : u32 = gl_GlobalInvocationID.x;
  let x_23 : u32 = x_18.block_id_offset;
  block_index = (x_15 + (x_23 * 32u));
  let x_36 : u32 = x_33.padded_dims.x;
  let x_39 : u32 = x_33.padded_dims.y;
  let x_45 : u32 = x_33.padded_dims.z;
  total_blocks = (((x_36 * x_39) / 64u) * x_45);
  let x_51 : vec4<u32> = x_33.padded_dims;
  n_blocks = (vec3<u32>(x_51.x, x_51.y, x_51.z) / vec3<u32>(4u, 4u, 4u));
  let x_56 : u32 = block_index;
  let x_57 : u32 = total_blocks;
  if ((x_56 >= x_57)) {
    return;
  }
  let x_64 : u32 = block_index;
  let x_66 : u32 = n_blocks.x;
  block_pos.x = (x_64 % x_66);
  let x_69 : u32 = block_index;
  let x_71 : u32 = n_blocks.x;
  let x_74 : u32 = n_blocks.y;
  block_pos.y = ((x_69 / x_71) % x_74);
  let x_77 : u32 = block_index;
  let x_79 : u32 = n_blocks.x;
  let x_81 : u32 = n_blocks.y;
  block_pos.z = (x_77 / (x_79 * x_81));
  let x_92 : u32 = block_index;
  let x_95 : vec2<f32> = x_91.block_ranges[x_92];
  cell_range = x_95;
  k = 0i;
  loop {
    let x_103 : i32 = k;
    if ((x_103 < 2i)) {
    } else {
      break;
    }
    j = 0i;
    loop {
      let x_112 : i32 = j;
      if ((x_112 < 2i)) {
      } else {
        break;
      }
      i = 0i;
      loop {
        var x_144 : bool;
        var x_145 : bool;
        var x_152 : bool;
        var x_153 : bool;
        let x_120 : i32 = i;
        if ((x_120 < 2i)) {
        } else {
          break;
        }
        let x_123 : i32 = i;
        let x_125 : i32 = j;
        let x_127 : i32 = k;
        neighbor = vec3<u32>(bitcast<u32>(x_123), bitcast<u32>(x_125), bitcast<u32>(x_127));
        let x_131 : vec3<u32> = block_pos;
        let x_132 : vec3<u32> = neighbor;
        coords = (x_131 + x_132);
        let x_134 : vec3<u32> = neighbor;
        let x_138 : bool = all((x_134 == vec3<u32>(0u, 0u, 0u)));
        x_145 = x_138;
        if (!(x_138)) {
          let x_142 : vec3<u32> = coords;
          x_144 = any((x_142 < vec3<u32>(0u, 0u, 0u)));
          x_145 = x_144;
        }
        x_153 = x_145;
        if (!(x_145)) {
          let x_149 : vec3<u32> = coords;
          let x_150 : vec3<u32> = n_blocks;
          x_152 = any((x_149 >= x_150));
          x_153 = x_152;
        }
        if (x_153) {
          continue;
        }
        let x_159 : u32 = coords.x;
        let x_161 : u32 = n_blocks.x;
        let x_163 : u32 = coords.y;
        let x_165 : u32 = n_blocks.y;
        let x_167 : u32 = coords.z;
        neighbor_id = (x_159 + (x_161 * (x_163 + (x_165 * x_167))));
        let x_172 : u32 = neighbor_id;
        let x_175 : f32 = x_91.block_ranges[x_172].x;
        let x_178 : f32 = cell_range.x;
        cell_range.x = min(x_175, x_178);
        let x_181 : u32 = neighbor_id;
        let x_183 : f32 = x_91.block_ranges[x_181].y;
        let x_185 : f32 = cell_range.y;
        cell_range.y = max(x_183, x_185);

        continuing {
          let x_188 : i32 = i;
          i = (x_188 + 1i);
        }
      }

      continuing {
        let x_190 : i32 = j;
        j = (x_190 + 1i);
      }
    }

    continuing {
      let x_192 : i32 = k;
      k = (x_192 + 1i);
    }
  }
  let x_198 : u32 = block_index;
  let x_199 : vec2<f32> = cell_range;
  x_197.voxel_ranges[x_198] = x_199;
  return;
}

@compute @workgroup_size(32i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const compute_coarse_cell_range_comp_spv = `struct BlockIDOffset {
  block_id_offset : u32,
}

struct VolumeParams {
  volume_dims : vec4<u32>,
  padded_dims : vec4<u32>,
  volume_scale : vec4<f32>,
  max_bits : u32,
  isovalue : f32,
  image_width : u32,
}

alias RTArr = array<vec2<f32>>;

alias RTArr_1 = array<vec2<f32>>;

struct BrickInformation {
  voxel_ranges : RTArr_1,
}

struct CoarseCellRange {
  coarse_cell_ranges : RTArr_1,
}

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(1) var<uniform> x_18 : BlockIDOffset;

@group(0) @binding(0) var<uniform> x_33 : VolumeParams;

@group(0) @binding(2) var<storage, read_write> x_119 : BrickInformation;

@group(0) @binding(3) var<storage, read_write> x_210 : CoarseCellRange;

fn main_1() {
  var coarse_cell_idx : u32;
  var total_coarse_cells : u32;
  var n_blocks : vec3<u32>;
  var n_cells : vec3<u32>;
  var cell_pos : vec3<u32>;
  var block_pos : vec3<u32>;
  var block_idx : u32;
  var coarse_cell_range : vec2<f32>;
  var k : i32;
  var j : i32;
  var i : i32;
  var offs : vec3<u32>;
  var coords : vec3<u32>;
  var cur_block_idx : u32;
  let x_15 : u32 = gl_GlobalInvocationID.x;
  let x_23 : u32 = x_18.block_id_offset;
  coarse_cell_idx = (x_15 + (x_23 * 32u));
  let x_36 : u32 = x_33.padded_dims.x;
  let x_39 : u32 = x_33.padded_dims.y;
  let x_45 : u32 = x_33.padded_dims.z;
  total_coarse_cells = (((x_36 * x_39) / 4096u) * x_45);
  let x_47 : u32 = coarse_cell_idx;
  let x_48 : u32 = total_coarse_cells;
  if ((x_47 >= x_48)) {
    return;
  }
  let x_58 : vec4<u32> = x_33.padded_dims;
  n_blocks = (vec3<u32>(x_58.x, x_58.y, x_58.z) / vec3<u32>(4u, 4u, 4u));
  let x_64 : vec3<u32> = n_blocks;
  n_cells = vec3<u32>(ceil((vec3<f32>(x_64) / vec3<f32>(4.0f, 4.0f, 4.0f))));
  let x_73 : u32 = coarse_cell_idx;
  let x_75 : u32 = n_cells.x;
  cell_pos.x = (x_73 % x_75);
  let x_78 : u32 = coarse_cell_idx;
  let x_80 : u32 = n_cells.x;
  let x_83 : u32 = n_cells.y;
  cell_pos.y = ((x_78 / x_80) % x_83);
  let x_86 : u32 = coarse_cell_idx;
  let x_88 : u32 = n_cells.x;
  let x_90 : u32 = n_cells.y;
  cell_pos.z = (x_86 / (x_88 * x_90));
  let x_95 : vec3<u32> = cell_pos;
  block_pos = (x_95 * vec3<u32>(4u, 4u, 4u));
  let x_100 : u32 = block_pos.x;
  let x_102 : u32 = n_blocks.x;
  let x_104 : u32 = block_pos.y;
  let x_106 : u32 = n_blocks.y;
  let x_108 : u32 = block_pos.z;
  block_idx = (x_100 + (x_102 * (x_104 + (x_106 * x_108))));
  let x_120 : u32 = block_idx;
  let x_123 : vec2<f32> = x_119.voxel_ranges[x_120];
  coarse_cell_range = x_123;
  k = 0i;
  loop {
    let x_131 : i32 = k;
    if ((x_131 < 4i)) {
    } else {
      break;
    }
    j = 0i;
    loop {
      let x_140 : i32 = j;
      if ((x_140 < 4i)) {
      } else {
        break;
      }
      i = 0i;
      loop {
        let x_148 : i32 = i;
        if ((x_148 < 4i)) {
        } else {
          break;
        }
        let x_151 : i32 = i;
        let x_153 : i32 = j;
        let x_155 : i32 = k;
        offs = vec3<u32>(bitcast<u32>(x_151), bitcast<u32>(x_153), bitcast<u32>(x_155));
        let x_159 : vec3<u32> = block_pos;
        let x_160 : vec3<u32> = offs;
        coords = (x_159 + x_160);
        let x_162 : vec3<u32> = coords;
        let x_163 : vec3<u32> = n_blocks;
        if (any((x_162 >= x_163))) {
          continue;
        }
        let x_172 : u32 = coords.x;
        let x_174 : u32 = n_blocks.x;
        let x_176 : u32 = coords.y;
        let x_178 : u32 = n_blocks.y;
        let x_180 : u32 = coords.z;
        cur_block_idx = (x_172 + (x_174 * (x_176 + (x_178 * x_180))));
        let x_185 : u32 = cur_block_idx;
        let x_188 : f32 = x_119.voxel_ranges[x_185].x;
        let x_191 : f32 = coarse_cell_range.x;
        coarse_cell_range.x = min(x_188, x_191);
        let x_194 : u32 = cur_block_idx;
        let x_196 : f32 = x_119.voxel_ranges[x_194].y;
        let x_198 : f32 = coarse_cell_range.y;
        coarse_cell_range.y = max(x_196, x_198);

        continuing {
          let x_201 : i32 = i;
          i = (x_201 + 1i);
        }
      }

      continuing {
        let x_203 : i32 = j;
        j = (x_203 + 1i);
      }
    }

    continuing {
      let x_205 : i32 = k;
      k = (x_205 + 1i);
    }
  }
  let x_211 : u32 = coarse_cell_idx;
  let x_212 : vec2<f32> = coarse_cell_range;
  x_210.coarse_cell_ranges[x_211] = x_212;
  return;
}

@compute @workgroup_size(32i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const reset_speculative_ids_comp_spv = `struct VolumeParams {
  volume_dims : vec4<u32>,
  padded_dims : vec4<u32>,
  volume_scale : vec4<f32>,
  max_bits : u32,
  isovalue : f32,
  image_width : u32,
}

alias RTArr = array<u32>;

alias RTArr_1 = array<u32>;

struct RayIDs {
  ray_ids : RTArr_1,
}

alias RTArr_2 = array<vec2<f32>>;

struct RayRGBZ {
  ray_rgbz : RTArr_2,
}

struct RayBlockIDs {
  block_ids : RTArr_1,
}

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(0) var<uniform> x_19 : VolumeParams;

@group(0) @binding(1) var<storage, read_write> x_44 : RayIDs;

@group(0) @binding(2) var<storage, read_write> x_53 : RayRGBZ;

@group(0) @binding(3) var<storage, read_write> x_63 : RayBlockIDs;

fn main_1() {
  var ray_index : u32;
  let x_13 : u32 = gl_GlobalInvocationID.x;
  let x_24 : u32 = x_19.image_width;
  if ((x_13 >= x_24)) {
    return;
  }
  let x_33 : u32 = gl_GlobalInvocationID.x;
  let x_36 : u32 = gl_GlobalInvocationID.y;
  let x_38 : u32 = x_19.image_width;
  ray_index = (x_33 + (x_36 * x_38));
  let x_46 : u32 = ray_index;
  x_44.ray_ids[x_46] = 4294967295u;
  let x_54 : u32 = ray_index;
  x_53.ray_rgbz[x_54] = vec2<f32>(bitcast<f32>(0i), 340282346638528859811704183484516925440.0f);
  let x_64 : u32 = ray_index;
  x_63.block_ids[x_64] = 4294967295u;
  return;
}

@compute @workgroup_size(32i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const depth_composite_comp_spv = `struct VolumeParams {
  volume_dims : vec4<u32>,
  padded_dims : vec4<u32>,
  volume_scale : vec4<f32>,
  max_bits : u32,
  isovalue : f32,
  image_width : u32,
}

struct ViewParams {
  proj_view : mat4x4<f32>,
  eye_pos : vec4<f32>,
  eye_dir : vec4<f32>,
  near_plane : f32,
  current_pass_index : u32,
  speculation_count : u32,
}

alias RTArr = array<u32>;

struct RayIDs {
  ray_ids : RTArr,
}

alias RTArr_1 = array<vec2<f32>>;

struct RayRGBZ {
  ray_rgbz : RTArr_1,
}

struct RayInfo {
  ray_dir : vec3<f32>,
  t : f32,
}

alias RTArr_2 = array<RayInfo>;

struct RayInformation {
  rays : RTArr_2,
}

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(4) var<uniform> x_59 : VolumeParams;

@group(0) @binding(0) var<uniform> x_72 : ViewParams;

@group(0) @binding(1) var<storage, read_write> x_95 : RayIDs;

@group(0) @binding(2) var<storage, read_write> x_143 : RayRGBZ;

@group(0) @binding(3) var render_target : texture_storage_2d<rgba8unorm, write>;

@group(1) @binding(0) var<storage, read_write> x_201 : RayInformation;

fn unpack_color_i1_(rgb8 : ptr<function, i32>) -> vec3<f32> {
  var rgb : vec3<f32>;
  rgb = vec3<f32>(0.0f, 0.0f, 0.0f);
  let x_18 : i32 = *(rgb8);
  rgb.x = (f32(((x_18 >> bitcast<u32>(24i)) & 255i)) / 255.0f);
  let x_30 : i32 = *(rgb8);
  rgb.y = (f32(((x_30 >> bitcast<u32>(16i)) & 255i)) / 255.0f);
  let x_38 : i32 = *(rgb8);
  rgb.z = (f32(((x_38 >> bitcast<u32>(8i)) & 255i)) / 255.0f);
  let x_46 : vec3<f32> = rgb;
  return x_46;
}

fn main_1() {
  var spec_index : u32;
  var ray_index : u32;
  var pixel_coords : vec2<i32>;
  var color : vec4<f32>;
  var i : i32;
  var param : i32;
  let x_54 : u32 = gl_GlobalInvocationID.x;
  let x_63 : u32 = x_59.image_width;
  if ((x_54 >= x_63)) {
    return;
  }
  let x_74 : u32 = x_72.speculation_count;
  if ((x_74 > 1u)) {
    let x_81 : u32 = gl_GlobalInvocationID.x;
    let x_83 : u32 = gl_GlobalInvocationID.y;
    let x_85 : u32 = x_59.image_width;
    let x_89 : u32 = x_72.speculation_count;
    spec_index = ((x_81 + (x_83 * x_85)) * x_89);
    let x_97 : u32 = spec_index;
    let x_99 : u32 = x_95.ray_ids[x_97];
    ray_index = x_99;
  } else {
    let x_102 : u32 = gl_GlobalInvocationID.x;
    let x_104 : u32 = gl_GlobalInvocationID.y;
    let x_106 : u32 = x_59.image_width;
    ray_index = (x_102 + (x_104 * x_106));
    let x_109 : u32 = ray_index;
    spec_index = x_109;
  }
  let x_113 : u32 = ray_index;
  let x_115 : u32 = x_59.image_width;
  let x_118 : u32 = ray_index;
  let x_120 : u32 = x_59.image_width;
  pixel_coords = vec2<i32>(bitcast<i32>((x_113 % x_115)), bitcast<i32>((x_118 / x_120)));
  color = vec4<f32>(0.0f, 0.0f, 0.0f, 340282346638528859811704183484516925440.0f);
  i = 0i;
  loop {
    let x_134 : i32 = i;
    let x_137 : u32 = x_72.speculation_count;
    if ((bitcast<u32>(x_134) < x_137)) {
    } else {
      break;
    }
    let x_144 : u32 = spec_index;
    let x_145 : i32 = i;
    let x_150 : f32 = x_143.ray_rgbz[(x_144 + bitcast<u32>(x_145))].y;
    let x_153 : f32 = color.w;
    if ((x_150 < x_153)) {
      let x_157 : u32 = spec_index;
      let x_158 : i32 = i;
      let x_162 : f32 = x_143.ray_rgbz[(x_157 + bitcast<u32>(x_158))].x;
      param = bitcast<i32>(x_162);
      let x_165 : vec3<f32> = unpack_color_i1_(&(param));
      let x_166 : vec4<f32> = color;
      color = vec4<f32>(x_165.x, x_165.y, x_165.z, x_166.w);
      let x_168 : u32 = spec_index;
      let x_169 : i32 = i;
      let x_173 : f32 = x_143.ray_rgbz[(x_168 + bitcast<u32>(x_169))].y;
      color.w = x_173;
    }

    continuing {
      let x_175 : i32 = i;
      i = (x_175 + 1i);
    }
  }
  let x_179 : f32 = color.w;
  if (!((x_179 == 340282346638528859811704183484516925440.0f))) {
    let x_187 : vec2<i32> = pixel_coords;
    let x_188 : vec4<f32> = color;
    let x_189 : vec3<f32> = vec3<f32>(x_188.x, x_188.y, x_188.z);
    textureStore(render_target, x_187, vec4<f32>(x_189.x, x_189.y, x_189.z, 1.0f));
  }
  return;
}

@compute @workgroup_size(32i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const mark_ray_active_comp_spv = `struct VolumeParams {
  volume_dims : vec4<u32>,
  padded_dims : vec4<u32>,
  volume_scale : vec4<f32>,
  max_bits : u32,
  isovalue : f32,
  image_width : u32,
}

alias RTArr = array<u32>;

struct RayActive {
  ray_active : RTArr,
}

struct RayInfo {
  ray_dir : vec3<f32>,
  t : f32,
}

alias RTArr_1 = array<RayInfo>;

struct RayInformation {
  rays : RTArr_1,
}

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(0) var<uniform> x_19 : VolumeParams;

@group(0) @binding(2) var<storage, read_write> x_44 : RayActive;

@group(0) @binding(1) var<storage, read_write> x_52 : RayInformation;

fn main_1() {
  var ray_index : u32;
  let x_13 : u32 = gl_GlobalInvocationID.x;
  let x_24 : u32 = x_19.image_width;
  if ((x_13 >= x_24)) {
    return;
  }
  let x_33 : u32 = gl_GlobalInvocationID.x;
  let x_36 : u32 = gl_GlobalInvocationID.y;
  let x_38 : u32 = x_19.image_width;
  ray_index = (x_33 + (x_36 * x_38));
  let x_46 : u32 = ray_index;
  let x_53 : u32 = ray_index;
  let x_57 : f32 = x_52.rays[x_53].t;
  x_44.ray_active[x_46] = bitcast<u32>(select(0i, 1i, !((x_57 == 340282346638528859811704183484516925440.0f))));
  return;
}

@compute @workgroup_size(32i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const color_active_rays_comp_spv = `struct VolumeParams {
  volume_dims : vec4<u32>,
  padded_dims : vec4<u32>,
  volume_scale : vec4<f32>,
  max_bits : u32,
  isovalue : f32,
  image_width : u32,
}

alias RTArr = array<u32>;

struct RayActive {
  ray_active : RTArr,
}

var<private> gl_GlobalInvocationID : vec3<u32>;

@group(0) @binding(0) var<uniform> x_19 : VolumeParams;

@group(0) @binding(1) var<storage, read_write> x_44 : RayActive;

@group(0) @binding(2) var render_target_copy : texture_2d<f32>;

@group(0) @binding(3) var render_target : texture_storage_2d<rgba8unorm, write>;

fn main_1() {
  var ray_index : u32;
  var pixel_coords : vec2<i32>;
  var color : vec4<f32>;
  var pixel_coords_1 : vec2<i32>;
  var color_1 : vec4<f32>;
  let x_13 : u32 = gl_GlobalInvocationID.x;
  let x_24 : u32 = x_19.image_width;
  if ((x_13 >= x_24)) {
    return;
  }
  let x_33 : u32 = gl_GlobalInvocationID.x;
  let x_36 : u32 = gl_GlobalInvocationID.y;
  let x_38 : u32 = x_19.image_width;
  ray_index = (x_33 + (x_36 * x_38));
  let x_46 : u32 = ray_index;
  let x_48 : u32 = x_44.ray_active[x_46];
  if ((x_48 == 1u)) {
    let x_55 : u32 = ray_index;
    let x_57 : u32 = x_19.image_width;
    let x_60 : u32 = ray_index;
    let x_62 : u32 = x_19.image_width;
    pixel_coords = vec2<i32>(bitcast<i32>((x_55 % x_57)), bitcast<i32>((x_60 / x_62)));
    let x_72 : vec2<i32> = pixel_coords;
    let x_73 : vec4<f32> = textureLoad(render_target_copy, x_72, 0i);
    color = x_73;
    let x_76 : vec2<i32> = pixel_coords;
    textureStore(render_target, x_76, vec4<f32>(1.0f, 0.0f, 0.0f, 1.0f));
  } else {
    let x_82 : u32 = ray_index;
    let x_84 : u32 = x_19.image_width;
    let x_87 : u32 = ray_index;
    let x_89 : u32 = x_19.image_width;
    pixel_coords_1 = vec2<i32>(bitcast<i32>((x_82 % x_84)), bitcast<i32>((x_87 / x_89)));
    let x_95 : vec2<i32> = pixel_coords_1;
    let x_96 : vec4<f32> = textureLoad(render_target_copy, x_95, 0i);
    color_1 = x_96;
    let x_99 : f32 = color_1.x;
    if ((x_99 == 1.0f)) {
      let x_104 : vec2<i32> = pixel_coords_1;
      textureStore(render_target, x_104, vec4<f32>(1.0f, 1.0f, 1.0f, 1.0f));
    }
  }
  return;
}

@compute @workgroup_size(32i, 1i, 1i)
fn main(@builtin(global_invocation_id) gl_GlobalInvocationID_param : vec3<u32>) {
  gl_GlobalInvocationID = gl_GlobalInvocationID_param;
  main_1();
}
`;

export const mark_block_active_wgsl_spv = `/*
// #include "util.glsl"
*/

const UINT_MAX: u32 = 0xffffffffu;
const FLT_MAX: f32 = 3.402823466e+38;

alias float2 = vec2<f32>;
alias float3 = vec3<f32>;
alias float4 = vec4<f32>;
alias uint2 = vec2<u32>;
alias uint3 = vec3<u32>;
alias uint4 = vec4<u32>;

struct RayInfo {
    ray_dir: float3,
    // block_id: u32,
    t: f32,
    // t_next: f32,
    // For WGSL we need to pad the struct up to 32 bytes so it matches
    // the GLSL struct alignment/padding rules we had before
    // @size(8) pad: f32
};

/*
layout(local_size_x = 8, local_size_y = 1, local_size_z = 1) in;
*/
/*
layout(set = 0, binding = 0, std140) uniform VolumeParams
{
    uvec4 volume_dims;
    uvec4 padded_dims;
    vec4 volume_scale;
    uint max_bits;
    float isovalue;
    uint image_width;
};
*/
struct VolumeParams {
  volume_dims: uint4,
  padded_dims: uint4,
  volume_scale: float4,
  max_bits: u32,
  isovalue: f32,
  image_width: u32,
}

@group(0) @binding(0) var<uniform> volume_params : VolumeParams;

/*
layout(set = 0, binding = 1, std140) uniform LOD
{
    uint LOD_threshold;
};
*/
struct LOD {
    threshold: f32,
}
@group(0) @binding(1) var<uniform> lod_threshold : LOD;

/*
layout(set = 0, binding = 2, std140) uniform ViewParams
{
    mat4 proj_view;
    vec4 eye_pos;
    vec4 eye_dir;
    float near_plane;
    uint current_pass_index;
};
*/
struct ViewParams {
  proj_view: mat4x4<f32>,
  eye_pos: float4,
  eye_dir: float4,
  near_plane : f32,
  current_pass_index: u32,
}
@group(0) @binding(2) var<uniform> view_params : ViewParams;

/*
layout(set = 0, binding = 3, std430) buffer BlockActive
{
    uint block_active[];
};
*/
// TODO: Is this valid WGSL? Try compiling with Tint
@group(0) @binding(3) var<storage, read_write> block_active : array<u32>;

/*
layout(set = 0, binding = 5, std430) buffer RayInformation
{
    RayInfo rays[];
};
*/
@group(0) @binding(4) var<storage, read_write> rays : array<RayInfo>;

/*
layout(set = 0, binding = 6, std430) buffer BlockVisible
{
    uint block_visible[];
};
*/
@group(0) @binding(5) var<storage, read_write> block_visible : array<atomic<u32>>;
@group(0) @binding(6) var<storage, read_write> block_ids : array<u32>;


//uniform layout(set = 1, binding = 0, rgba8) writeonly image2D render_target;
@group(1) @binding(0) var render_target : texture_storage_2d<rgba8unorm, write>;

fn block_id_to_pos(id: u32) -> uint3 {
    let n_blocks = volume_params.padded_dims.xyz / uint3(4u);
    return uint3(id % n_blocks.x,
            (id / n_blocks.x) % n_blocks.y,
            id / (n_blocks.x * n_blocks.y));
}

fn compute_block_id(block_pos: uint3) -> u32
{
    let n_blocks = volume_params.padded_dims.xyz / uint3(4u);
    return block_pos.x + n_blocks.x * (block_pos.y + n_blocks.y * block_pos.z);
}

@compute @workgroup_size(32, 1, 1)
fn main(@builtin(global_invocation_id) g_invocation_id : vec3<u32>) {
    if (g_invocation_id.x >= volume_params.image_width) {
        return;
    }

    let ray_index = g_invocation_id.x + g_invocation_id.y * volume_params.image_width;

    let block_id = block_ids[ray_index];
    if (block_id == UINT_MAX) {
        return;
    }
    let block_pos = block_id_to_pos(block_id);

    block_active[block_id] = 1u;
    //block_visible[block_id] = 1;
    let already_marked = atomicMax(&block_visible[block_id], 1u);

    // Count this ray for the block (this is now done in count_block_rays.wgsl
    //uint num_rays = atomicAdd(block_num_rays[block_id], uint(1)) + 1;
    //let num_rays = atomicAdd(&block_num_rays[block_id], 1u) + 1u;

    // Mark this ray's block's neighbors to the positive side as active
    // These blocks must be decompressed for neighbor data, but this ray
    // doesn't need to process them.
    if (already_marked == 0) {
        let n_blocks = volume_params.padded_dims.xyz / uint3(4u);
        for (var k = 0u; k < 2u; k += 1u) {
            for (var j = 0u; j < 2u; j += 1u) {
                for (var i = 0u; i < 2u; i += 1u) {
                    let neighbor = uint3(i, j, k);
                    let coords = block_pos + neighbor;
                    if (all(neighbor == uint3(0u)) || any(coords < uint3(0u)) || any(coords >= n_blocks)) {
                        continue;
                    }
                    let neighbor_id = compute_block_id(coords);
                    block_active[neighbor_id] = 1u;
                }               
            }
        }
    }
}
`;
export const count_block_rays_wgsl_spv = `/*
// #include "util.glsl"
*/

const UINT_MAX: u32 = 0xffffffffu;
const FLT_MAX: f32 = 3.402823466e+38;

alias float2 = vec2<f32>;
alias float3 = vec3<f32>;
alias float4 = vec4<f32>;
alias uint2 = vec2<u32>;
alias uint3 = vec3<u32>;
alias uint4 = vec4<u32>;

struct VolumeParams {
  volume_dims: uint4,
  padded_dims: uint4,
  volume_scale: float4,
  max_bits: u32,
  isovalue: f32,
  image_width: u32,
}

@group(0) @binding(0) var<uniform> volume_params : VolumeParams;

@group(0) @binding(1) var<storage, read_write> block_num_rays : array<atomic<u32>>;

@group(0) @binding(2) var<storage, read_write> ray_block_ids : array<u32>;

@group(0) @binding(3) var<storage, read_write> block_compact_offsets : array<u32>;


@compute @workgroup_size(32, 1, 1)
fn main(@builtin(global_invocation_id) g_invocation_id : vec3<u32>) {
    if (g_invocation_id.x >= volume_params.image_width) {
        return;
    }

    let ray_index = g_invocation_id.x + g_invocation_id.y * volume_params.image_width;

    let block_id = ray_block_ids[ray_index];
    if (block_id == UINT_MAX) {
        return;
    }

    // Count this ray for the block
    let block_index = block_compact_offsets[block_id];
    atomicAdd(&block_num_rays[block_index], 1u);
}

`;
