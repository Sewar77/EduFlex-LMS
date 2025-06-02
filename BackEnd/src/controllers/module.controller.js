import {
  createModule,
  updateModule,
  getAllModules,
  getModuleById,
  deleteModule,
} from "../models/module.model.js";

//create
export async function createModuleController(req, res) {
  try {
    const moduleInfo = { ...req.body };
    const createdModule = await createModule(moduleInfo);
    if (createdModule !== null) {
      return res.status(200).json({
        success: true,
        message: "Modules Created Successfully",
        data: createdModule,
      });
    }
    return res
      .status(400)
      .json({ success: false, message: "Can not create new module" });
  } catch (err) {
    console.error("Can't create new module:", err);
    res.status(500).json({
      success: false,
      message: "Failed to module course. Please try again later.",
    });
  }
}

//update
export async function updateModuleController(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid module ID." });
  }
  try {
    const moduleInfo = { ...req.body, id };
    const updatedModule = await updateModule(moduleInfo);

    if (updatedModule !== null) {
      return res.status(200).json({
        message: "Modules updated Successfully",
        success: true,
        data: updatedModule,
      });
    }
    return res
      .status(404)
      .json({ success: false, message: "Can not update new module" });
  } catch (err) {
    console.error("Can't update thew module:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update module course. Please try again later.",
    });
  }
}

//delete
export async function deleteModuleController(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid module ID." });
  }
  try {
    const deletedModule = await deleteModule(id);
    if (deletedModule === true) {
      return res.status(200).json({
        success: true,
        message: "Modules deleted Successfully",
      });
    }
    return res
      .status(404)
      .json({ success: false, message: "Can not delete new module" });
  } catch (err) {
    console.error("Can't delete thew module:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete module course. Please try again later.",
    });
  }
}

// Get all modules for a course
export async function getAllModulesController(req, res) {
  const course_id = Number(req.params.course_id);
  if (!Number.isInteger(course_id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid course ID CR." });
  }
  try {
    const allModules = await getAllModules(course_id);
    return res.status(200).json({
      success: true,
      data: allModules,
    });
  } catch (err) {
    console.error("Can't find the module:", err);
    res.status(500).json({
      success: false,
      message: "Failed to find module course. Please try again later.",
    });
  }
}

//get by id
export async function getModuleByIdController(req, res) {
  const module_id = Number(req.params.id);
  if (!Number.isInteger(module_id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid course ID." });
  }
  try {
    const module = await getModuleById(module_id);
    if (module !== null) {
      return res.status(200).json({
        success: true,
        data: module,
      });
    }
    return res
      .status(404)
      .json({ success: false, message: "Can not find module" });
  } catch (err) {
    console.error("Can't find the module:", err);
    res.status(500).json({
      success: false,
      message: "Failed to find module course. Please try again later.",
    });
  }
}
