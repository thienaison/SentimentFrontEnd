import axios from 'axios';

export const uploadFile = async(file, typeSentiment) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', typeSentiment);

    try{
        const res = await axios.post('https://phongnt251199-sentimentmodel.hf.space/predict-batch', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return res.data;
    }catch(error){
        console.log('Error uploading file:', error);
    }
}