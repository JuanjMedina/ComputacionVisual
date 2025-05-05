

import os
import argparse
import numpy as np
import pandas as pd


try:
    from vedo import Sphere, Cube, Cylinder, Assembly, Plotter
    import vedo
except ImportError:
    vedo = None

try:
    import trimesh
    from trimesh.scene import Scene
    from trimesh.exchange.export import export_mesh
except ImportError:
    trimesh = None

try:
    import open3d as o3d
except ImportError:
    o3d = None

# Directory for all exported results
RESULTS_DIR = "resultados"
os.makedirs(RESULTS_DIR, exist_ok=True)

def load_points(path):
    """
    Load points with columns x,y,z from a CSV or JSON file.
    If file not found or invalid, generates random points.
    """
    if os.path.exists(path):
        try:
            if path.lower().endswith('.csv'):
                df = pd.read_csv(path)
            else:
                df = pd.read_json(path)
            return df[['x','y','z']].values
        except Exception as e:
            print(f"Warning: failed to load '{path}' ({e}), generating random points.")
    # Fallback: random points in [-1,1]^3
    return np.random.uniform(-1, 1, size=(10, 3))

def save_points(points, path):
    """
    Save an array of points (Nx3) to a CSV or JSON file.
    """
    df = pd.DataFrame(points, columns=['x', 'y', 'z'])
    if path.lower().endswith('.csv'):
        df.to_csv(path, index=False)
    else:
        df.to_json(path, orient='records', indent=2)
    print(f"Saved points to {path}")

def demo_vedo(points, output_prefix):
    """
    Generate a vedo Assembly of spheres and cubes, export as OBJ/STL/GLB.
    """
    if vedo is None:
        print("vedo library not installed, skipping vedo demo.")
        return
    objects = []
    for i, (x, y, z) in enumerate(points):
        # alternate between sphere, cube, and cylinder
        if i % 3 == 0:
            obj = Sphere(pos=(x, y, z), r=0.2 + 0.02 * i, c='blue', res=24)
        elif i % 3 == 1:
            obj = Cube(pos=(x, y, z), side=0.3 + 0.02 * i, c='red')
        else:
            obj = Cylinder(pos=(x, y, z), r=0.15 + 0.02 * i, height=0.4 + 0.02 * i, c='green', res=24)
        objects.append(obj)
    scene = Assembly(objects)
    # Display interactively
    plt = Plotter(title='vedo Parametric Scene')
    plt.show(scene, "Press any key to continue...")
    # Export to OBJ, STL and GLTF
    for ext in ['.obj', '.stl', '.gltf']:
        out = os.path.join(RESULTS_DIR, f"{output_prefix}_vedo{ext}")
        scene.write(out)
        print(f"vedo scene exported to {out}")


def demo_trimesh(points, output_prefix):
    """
    Generate trimesh primitives, combine into a Scene, export as GLB, and individual OBJ/STL.
    """
    if trimesh is None:
        print("trimesh library not installed, skipping trimesh demo.")
        return
    meshes = []
    for i, (x, y, z) in enumerate(points):
        radius = 0.1 + 0.02 * (i % 5)
        # alternate between sphere, box, and cylinder
        if i % 3 == 0:
            m = trimesh.creation.icosphere(subdivisions=2, radius=radius)
        elif i % 3 == 1:
            m = trimesh.creation.box(extents=(radius*2, radius*2, radius*2))
        else:
            m = trimesh.creation.cylinder(radius=radius, height=radius*3)
        m.apply_translation([x, y, z])
        # color by height
        color = [255, 0, 0, 255] if z > 0 else [0, 0, 255, 255]
        m.visual.vertex_colors = color
        meshes.append(m)
    scene = Scene(meshes)
    # Export full scene as OBJ, STL and GLTF using export_mesh
    for ext, ftype in [('.obj','obj'),('.stl','stl'),('.gltf','gltf')]:
        out = os.path.join(RESULTS_DIR, f"{output_prefix}_trimesh{ext}")
        export_mesh(scene, out, file_type=ftype)
        print(f"trimesh scene exported to {out}")
    # Individual mesh exports
    for idx, mesh in enumerate(meshes):
        for ext, ftype in [('.obj','obj'),('.stl','stl'),('.gltf','gltf')]:
            out = os.path.join(RESULTS_DIR, f"{output_prefix}_mesh_{idx}{ext}")
            export_mesh(mesh, out, file_type=ftype)
            print(f"  - mesh {idx} exported to {out}")


def demo_open3d(points, output_prefix):
    """
    Generate open3d primitives, merge into one mesh, display and export as PLY/OBJ/STL.
    """
    if o3d is None:
        print("open3d library not installed, skipping open3d demo.")
        return
    mesh_list = []
    for i, (x, y, z) in enumerate(points):
        size = 0.1 + 0.02 * (i % 5)
        # alternate between sphere, box, and cylinder
        if i % 3 == 0:
            mesh = o3d.geometry.TriangleMesh.create_sphere(radius=size)
        elif i % 3 == 1:
            mesh = o3d.geometry.TriangleMesh.create_box(width=size, height=size, depth=size)
        else:
            mesh = o3d.geometry.TriangleMesh.create_cylinder(radius=size, height=size*2)
        mesh.translate((x, y, z))
        color = [1, 0, 0] if z > 0 else [0, 0, 1]
        mesh.paint_uniform_color(color)
        mesh.compute_vertex_normals()
        mesh_list.append(mesh)
    # combine all meshes
    combined = mesh_list[0]
    for m in mesh_list[1:]:
        combined += m
    o3d.visualization.draw_geometries([combined], window_name='open3d Parametric Scene')
    # export as OBJ, STL and GLTF
    for ext in ['.obj', '.stl', '.gltf']:
        out = os.path.join(RESULTS_DIR, f"{output_prefix}_open3d{ext}")
        o3d.io.write_triangle_mesh(out, combined)
        print(f"open3d mesh exported to {out}")


def main():
    parser = argparse.ArgumentParser(description='Parametric 3D Scene Generation Demo')
    parser.add_argument('-i', '--input', default='points.csv', help='CSV or JSON input file with x,y,z')
    parser.add_argument('-e', '--export-data', help='Path to export loaded/generated points to CSV or JSON')
    parser.add_argument('-b', '--backend', choices=['vedo', 'trimesh', 'open3d', 'all'], default='all', help='Which backend to run')
    parser.add_argument('-o', '--output-prefix', default='scene', help='Output filename prefix')
    args = parser.parse_args()

    # sanitize prefix to avoid nested folders
    prefix = os.path.basename(args.output_prefix)
    if not prefix:
        prefix = args.output_prefix

    points = load_points(args.input)
    if args.export_data:
        save_points(points, args.export_data)
    # Run selected backends using sanitized prefix
    if args.backend in ('vedo', 'all'):
        demo_vedo(points, prefix)
    if args.backend in ('trimesh', 'all'):
        demo_trimesh(points, prefix)
    if args.backend in ('open3d', 'all'):
        demo_open3d(points, prefix)

if __name__ == '__main__':
    main()
