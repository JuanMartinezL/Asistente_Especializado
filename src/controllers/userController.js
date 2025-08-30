import User from "../models/User";

export const getUsers = async (req, res) =>{
    try{
        const users = await User.find();
        res.json(users);
    }catch(error){
        console.error('Error al obtener los usuarios: ', error
        );
        res.status(500).json({message: 'Error al obtener los usuarios' });
    }
};