import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import styles from "./Client.module.css";
import type { Client as ClientModel } from "../../types/Client";
import { useState, useEffect, useContext } from "react";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useAppDispatch } from "../../redux/hooks";
import {
  useCreateClientMutation,
  useDeleteClientMutation,
  useGetClientsQuery,
  useUpdateClientMutation,
} from "../../redux/services/ludotecaApi";

import { setMessage } from "../../redux/features/manageSlice";
import type { BackError } from "../../types/BackError";
import { LoaderContext } from "../../context/LoaderProvider";
import CreateClient from "./components/CreateClient";
import { AlertDialog } from "../../components/AlertDialog";

export const Client = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [clientToUpdate, setClientToUpdate] = useState<ClientModel | null>(
    null,
  );
  const [idToDelete, setIdToDelete] = useState("");
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();
  const { data, error, isLoading } = useGetClientsQuery(null);

  const [deleteClientApi, { isLoading: isLoadingDelete, error: errorDelete }] =
    useDeleteClientMutation();

  const [createClientApi, { isLoading: isLoadingCreate }] =
    useCreateClientMutation();

  const [updateClientApi, { isLoading: isLoadingUpdate }] =
    useUpdateClientMutation();

  const loader = useContext(LoaderContext);

  useEffect(() => {
    if (errorDelete) {
      if ("status" in errorDelete) {
        dispatch(
          setMessage({
            text: (errorDelete?.data as BackError).msg,
            type: "error",
          }),
        );
      }
    }
  }, [errorDelete, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(setMessage({ text: "Se ha producido un error", type: "error" }));
    }
  }, [dispatch, error]);

  useEffect(() => {
    loader.showLoading(
      isLoadingCreate || isLoading || isLoadingDelete || isLoadingUpdate,
    );
  }, [isLoadingCreate, isLoading, isLoadingDelete, isLoadingUpdate, loader]);

  const handleCloseCreate = () => {
    setOpenCreate(false);
    setClientToUpdate(null);
  };

  const createClient = (client: string) => {
    setOpenCreate(false);
    if (clientToUpdate) {
      updateClientApi({ id: clientToUpdate.id, name: client })
        .then((res) => {
          setClientToUpdate(null);
          if (res.error?.status === 500) {
            setOpen(true);
            return;
          }
          dispatch(
            setMessage({
              text: "Cliente actualizado correctamente",
              type: "ok",
            }),
          );
        })
        .catch((err) => console.log(err));
    } else {
      createClientApi({ name: client })
        .then((res) => {
          setClientToUpdate(null);
          if (res.error?.status === 500) {
            setOpen(true);
            return;
          }
          dispatch(
            setMessage({ text: "Cliente creado correctamente", type: "ok" }),
          );
        })
        .catch((err) => console.log(err));
    }
  };

  const deleteClient = () => {
    deleteClientApi(idToDelete)
      .then(() => {
        dispatch(
          setMessage({
            text: "Cliente borrado correctamente",
            type: "ok",
          }),
        );
        setIdToDelete("");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <h1>Listado de Clientes</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead
            sx={{
              "& th": {
                backgroundColor: "lightgrey",
              },
            }}
          >
            <TableRow>
              <TableCell>Identificador</TableCell>
              <TableCell>Nombre cliente</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.map((client: ClientModel) => (
                <TableRow
                  key={client.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {client.id}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {client.name}
                  </TableCell>
                  <TableCell>
                    <div className={styles.tableActions}>
                      <IconButton
                        aria-label="update"
                        color="primary"
                        onClick={() => {
                          setClientToUpdate(client);
                          setOpenCreate(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => {
                          setIdToDelete(client.id);
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="newButton">
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Nuevo cliente
        </Button>
      </div>
      {openCreate && (
        <CreateClient
          create={createClient}
          client={clientToUpdate}
          closeModal={handleCloseCreate}
        />
      )}
      {!!idToDelete && (
        <ConfirmDialog
          title="Eliminar cliente"
          text="Atención si borra el cliente se perderán sus datos. ¿Desea eliminar el cliente?"
          confirm={deleteClient}
          closeModal={() => setIdToDelete("")}
        />
      )}
      {!!open && (
        <AlertDialog
          title="Ha ocurrido un error"
          text="El cliente está duplicado"
          closeModal={() => setOpen(false)}
        />
      )}
    </div>
  );
};
