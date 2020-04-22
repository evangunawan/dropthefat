import * as React from 'react';
import * as firebase from 'firebase';
import 'firebase/firestore';
import {
  Modal,
  Fade,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
} from '@material-ui/core';
import { Vendor } from '../../models/Vendor';
import { Product } from '../../models/Product';
const [vendor, setVendor] = React.useState<Vendor[]>([]);
const [loading, setLoading] = React.useState(false);
const db = firebase.firestore();
const [filterVendor, setFilterVendor] = React.useState([] as any[]);

interface ModalProps {
  open: boolean;
  onClose(): void;
  vendorList: Vendor[];
  onVendorSelect(item: Vendor): void;
  // onMenuAdd(item: DiningTable): void;
}

interface BoxProps {
  item: Vendor;
  rsvTime: number;
  onClick(): void;
}

const VendorButton = (props: BoxProps) => {

//   return (
//     <Grid item xs={3}>
//       <Button
//         disableRipple
//         fullWidth
//         variant='contained'
//         style={style}
//         onClick={props.onClick}
//         disabled={isTableDisabled()}
//       >
//         {`Table ${props.item.tableNumber}`}
//       </Button>
//     </Grid>
//   );
// };

//   const renderTableItems = (items: DiningTable[], guests: number) => {
//     const filtered = items.filter((item: DiningTable) => {
//       return item.type === getTableType(guests);
//     });
//     const result = filtered.map((item: DiningTable) => {
//       const rsvTime =
//         reservations.find((rsv) => rsv.tableNumber === item.tableNumber)
//           ?.reservationTime || 0;
//       return (
//         <TableButton
//           item={item}
//           onClick={() => {
//             props.onTableSelect(item);
//             props.onClose();
//           }}
//           rsvTime={rsvTime}
//           key={item.id}
//         />
//       );
//     });
//     return result;
//   };

const fetchVendor = async () => {
    
    const result: Vendor[] = [];
    setLoading(true);
    await db
      .collection('vendor')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const listProduct: Product[] = [];
          doc.data().products.forEach((item: any) => {
            const newProduct: Product = {
              name: item.name,
              unit: item.unit || 'unit',
              price: item.price,
            };
            listProduct.push(newProduct);
          });
          const newVendor: Vendor = {
            id: doc.id,
            name: doc.data().name,
            address: doc.data().address,
            contact: doc.data().contact,
            products: listProduct,
          };
          result.push(newVendor);
          // console.log(doc.data());
        });
      });
    setVendor(result);
    setFilterVendor(result);
    setLoading(false);
  };



  React.useEffect(() => {
    fetchVendor();
    // eslint-disable-next-line
  }, []);

  return (
    <Modal open={props.open} onClose={props.onClose} style={modalStyle}>
      <Fade in={props.open}>
        <Card style={cardStyle}>
          <CardContent>
            <Grid container justify='space-between' alignItems='center'>
              <Typography variant='h5'>Select Table</Typography>
              <Typography variant='body2'>{`Guest: ${
                props.guests
              } person, Table type: ${getTableType(props.guests)}`}</Typography>
            </Grid>
            <Grid
              container
              justify='flex-start'
              spacing={3}
              style={{ margin: '16px 0px' }}
            >
              {renderTableItems(props.tableList, props.guests)}
            </Grid>
            <div>
              <Typography variant='body2' color='textSecondary'>
                <i>
                  *Green: Available, Blue: Dining/Active, Orange: Reserved under 2 hours,
                  Grey: Unavailable
                </i>
              </Typography>
            </div>
          </CardContent>
        </Card>
      </Fade>
    </Modal>
  );
};

export default ChangeTableModal;
