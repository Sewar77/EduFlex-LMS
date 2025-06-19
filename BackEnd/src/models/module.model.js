import { query } from "../config/db.js";

//create
export async function createModule(modulesInfo) {
  try {
    const newModule = await query(
      `insert into modules (course_id, title, description, "order") values($1, $2, $3, $4) RETURNING *`,
      [
        modulesInfo.course_id,
        modulesInfo.title,
        modulesInfo.description,
        modulesInfo.order,
      ]
    );
    return newModule.rows[0] || null;
  } catch (err) {
    throw err;
  }
}

//update
export async function updateModule(modulesInfo) {
  try {
    const updatedModule = await query(
      `UPDATE modules 
        SET course_id = $1, title = $2,
        description = $3, "order" = $4
        WHERE id = $5 RETURNING *`,
      [
        modulesInfo.course_id,
        modulesInfo.title,
        modulesInfo.description,
        modulesInfo.order,
        modulesInfo.id,
      ]
    );
    return updatedModule.rows[0] || null ;
  } catch (err) {
    throw err;
  }
}

//get all modules for a spacific course
export async function getAllModules(course_id) {
  try {
    if (Number.isInteger(course_id)) {
      const allModules = await query(
        `SELECT id, course_id, "order", title, description FROM modules 
         WHERE course_id = $1
         ORDER BY "order" ASC`,
        [course_id]
      );
      return allModules.rows;
    } else {
      throw new Error("Invalid Modules Id");
    }
  } catch (err) {
    throw err;
  }
}


//get a spacific module by ID
export async function getModuleById(module_id) {
  try {
    if (Number.isInteger(module_id)) {
      const module = await query(
        `select id, course_id, "order", title, description from modules where id = $1 `,
        [module_id]
      );
      return module.rows[0] || null;
    } else {
      throw new Error("Invalid Modules Id");
    }
  } catch (err) {
    throw err;
  }
}

//delete module
export async function deleteModule(module_id) {
  try {
    if (Number.isInteger(module_id)) {
      const deletedModules = await query(
        `delete from modules 
        where id = $1 `,
        [module_id]
      );
      if (deletedModules.rowCount > 0) return true;
      return false;
    } else {
      throw new Error("Invalid Modules Id");
    }
  } catch (err) {
    throw err;
  }
}
