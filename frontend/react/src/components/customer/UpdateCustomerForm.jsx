import { Form, Formik, useField } from 'formik';
import * as Yup from 'yup';
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    VStack,
    Stack,
    FormLabel
} from "@chakra-ui/react";
import { updateCustomer, uploadCustomerProfilePicture, customerProfilePictureUrl } from "../../services/client.js";
import { successNotification, errorNotification } from "../../services/notification.js";
import { useDropzone } from "react-dropzone";
import { useCallback, useState, useEffect } from "react";

const MyTextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <Box>
            <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
            <input {...field} {...props} />
            {meta.touched && meta.error ? (
                <Alert status="error" mt={2}>
                    <AlertIcon />
                    {meta.error}
                </Alert>
            ) : null}
        </Box>
    );
};

// Component to handle JWT-protected image display
function CustomerImage({ customerId, refreshKey }) {
    const [imgSrc, setImgSrc] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        fetch(customerProfilePictureUrl(customerId), {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.blob())
            .then(blob => setImgSrc(URL.createObjectURL(blob)))
            .catch(err => console.error("Error fetching image:", err));
    }, [customerId, refreshKey]); // refreshKey triggers reload after upload

    if (!imgSrc) return null;

    return (
        <img
            src={imgSrc}
            alt="Profile"
            style={{ borderRadius: "50%", width: 150, height: 150, objectFit: "cover" }}
        />
    );
}

function MyDropzone({ customerId, onUploadSuccess }) {
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append("file", file);

        uploadCustomerProfilePicture(customerId, formData)
            .then(() => {
                successNotification("Success", "Profile picture uploaded");
                onUploadSuccess(); // trigger image refresh
            })
            .catch(() => {
                errorNotification("Failed", "Profile picture upload failed");
            });
    }, [customerId, onUploadSuccess]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <Box
            w="100%"
            textAlign="center"
            border="dashed"
            borderColor="gray.200"
            p="6"
            rounded="md"
            borderRadius="3xl"
            {...getRootProps()}
        >
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop the picture here ...</p> : <p>Drag 'n' drop picture here, or click to select picture</p>}
        </Box>
    );
}

const UpdateCustomerForm = ({ fetchCustomers, initialValues, customerId }) => {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleUploadSuccess = () => setRefreshKey(prev => prev + 1); // increment to trigger image reload

    return (
        <>
            <VStack spacing={5} mb={5}>
                <CustomerImage customerId={customerId} refreshKey={refreshKey} />
                <MyDropzone customerId={customerId} onUploadSuccess={handleUploadSuccess} />
            </VStack>

            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object({
                    name: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
                    email: Yup.string().email('Invalid email').required('Required'),
                    age: Yup.number().min(16, 'Must be at least 16').max(100, 'Must be less than 100').required(),
                })}
                onSubmit={(updatedCustomer, { setSubmitting }) => {
                    setSubmitting(true);
                    updateCustomer(customerId, updatedCustomer)
                        .then(() => {
                            successNotification("Customer updated", `${updatedCustomer.name} was successfully updated`);
                            fetchCustomers();
                        })
                        .catch(err => {
                            errorNotification(err.code, err.response?.data?.message || "Update failed");
                        })
                        .finally(() => setSubmitting(false));
                }}
            >
                {({ isValid, isSubmitting, dirty }) => (
                    <Form>
                        <Stack spacing="24px">
                            <MyTextInput label="Name" name="name" type="text" placeholder="Jane" />
                            <MyTextInput label="Email Address" name="email" type="email" placeholder="jane@formik.com" />
                            <MyTextInput label="Age" name="age" type="number" placeholder="20" />
                            <Button disabled={!(isValid && dirty) || isSubmitting} type="submit">Submit</Button>
                        </Stack>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default UpdateCustomerForm;
