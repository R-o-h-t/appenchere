import { DataStore } from "aws-amplify";
import * as React from "react";
import {
  Button,
  Dialog,
  Paragraph,
  Portal,
  TextInput,
} from "react-native-paper";
import useAuthenticatedUser from "../../hooks/useAuthenticatedUser";
import { Offer, Price } from "../../models";

interface Props {
  visible: boolean;
  offer?: Offer;
  onCancel: () => void;
  onValidate: () => void;
  currentPrice?: Price;
}

const JoinOfferDialog: React.FC<Props> = ({
  visible,
  offer,
  onCancel,
  onValidate,
  currentPrice,
}) => {
  const [amount, setAmount] = React.useState(0);
  const user = useAuthenticatedUser();

  React.useEffect(() => {
    if (currentPrice) {
      setAmount(currentPrice.value + 1);
    }
  }, [currentPrice]);

  const onContinue = () => {
    if ((currentPrice && amount <= currentPrice.value) || amount < 0) {
      alert("le montant doit être supérieur au prix de l'offre");
    }
    if (offer && amount > 0) {
      if (user !== undefined) {
        DataStore.save(
          new Price({
            value: amount,
            userID: user.id,
            offerID: offer.id,
          })
        )
          .then(() => {
            onValidate();
          })
          .catch((e) => {
            console.error(e);
          });
      } else {
        alert("Veuillez vous connecter pour participer à l'offre");
      }
    }
  };
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title onPressIn={() => {}} onPressOut={() => {}}>
          {offer ? offer.product?.label : "Offer"}
        </Dialog.Title>
        <Dialog.Content>
          <Paragraph>Selectionner le montant desiré</Paragraph>
          <TextInput
            label="Montant"
            value={amount.toString()}
            onChangeText={(value) => setAmount(parseInt(value))}
            autoComplete="email"
            keyboardType="numeric"
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>Annuler</Button>
          <Button onPress={onContinue}>Valider</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default JoinOfferDialog;
